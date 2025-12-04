import Database from 'better-sqlite3'
import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
// Prefer prisma/dev.db if present (that's where Prisma stores the dev DB)
const defaultPaths = [path.join(process.cwd(), 'prisma', 'dev.db'), path.join(process.cwd(), 'dev.db')]
const sqlitePath = process.env.SQLITE_PATH || defaultPaths.find(p => fs.existsSync(p))
const pgUrl = process.env.DATABASE_URL

if (!pgUrl) {
  console.error('FATAL: environment variable DATABASE_URL not set')
  process.exit(1)
}

function pretty(n){ return n.toLocaleString() }

async function main(){
  console.log('\nMIGRATION SCRIPT (SQLite -> Neon Postgres)')
  console.log('Mode:', dryRun ? 'DRY-RUN (no changes)' : 'LIVE (will insert)')
  console.log('SQLite:', sqlitePath)
  console.log('Postgres (Neon):', pgUrl.replace(/(postgres:\/\/).*@/, '$1***@'))

  if (!fs.existsSync(sqlitePath)){
    console.error('SQLite file not found at', sqlitePath)
    process.exit(1)
  }

  const sqlite = new Database(sqlitePath, { readonly: true })

  // Read available tables from sqlite
  const tbls = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r => r.name)
  const tables = new Set(tbls.map(t => t.toLowerCase()))

  function safeSelect(sql, fallback = []){
    try {
      return sqlite.prepare(sql).all()
    } catch (e){
      return fallback
    }
  }

  // Attempt to read common table names; some DBs may have different casing
  const users = tables.has('user') || tables.has('users') ? safeSelect('SELECT id, email, password, createdAt FROM "User"') : []
  const blocks = tables.has('block') || tables.has('blocks') ? safeSelect('SELECT * FROM "Block"') : []
  const events = tables.has('event') || tables.has('events') ? safeSelect('SELECT * FROM "Event"') : []

  console.log(`\nCounts: Users=${pretty(users.length)}, Blocks=${pretty(blocks.length)}, Events=${pretty(events.length)}`)

  // sample
  console.log('\nSample block names:')
  blocks.slice(0,5).forEach(b => console.log(' -', b.nome))

  if (dryRun) {
    console.log('\nDry run complete. No changes were made to Neon.')
    process.exit(0)
  }

  console.log('\nConnecting to Postgres...')
  const pool = new Pool({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Create tables if not exist (simple schema compatible with prisma schema)
    await client.query(`
      CREATE TABLE IF NOT EXISTS "User" (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        "createdAt" TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS "Block" (
        id TEXT PRIMARY KEY,
        nome TEXT,
        descricao TEXT,
        contato TEXT,
        foto TEXT,
        "localLat" DOUBLE PRECISION,
        "localLng" DOUBLE PRECISION,
        cidade TEXT,
        estado TEXT,
        endereco TEXT,
        "vertenteFeminista" TEXT,
        formacao TEXT,
        atividades TEXT,
        dias TEXT,
        imagens TEXT,
        videos TEXT,
        "redesSociais" TEXT,
        "ownerId" TEXT
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS "Event" (
        id TEXT PRIMARY KEY,
        nome TEXT,
        data TIMESTAMP,
        descricao TEXT,
        foto TEXT,
        "blocoId" TEXT,
        local TEXT,
        cidade TEXT,
        estado TEXT,
        tipo TEXT,
        horario TEXT
      )
    `)

    // Insert users
    console.log('\nInserting users (upsert semantics: do nothing on conflict)')
    for (const u of users){
      const q = `INSERT INTO "User"(id, email, password, "createdAt") VALUES($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING`
      await client.query(q, [u.id, u.email, u.password, u.createdAt])
    }

    console.log('Users done')

    // Insert blocks
    console.log('\nInserting blocks')
    for (const b of blocks){
      const q = `INSERT INTO "Block"(id, nome, descricao, contato, foto, "localLat", "localLng", cidade, estado, endereco, "vertenteFeminista", formacao, atividades, dias, imagens, videos, "redesSociais", "ownerId") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) ON CONFLICT (id) DO NOTHING`
      const params = [b.id, b.nome, b.descricao || null, b.contato || null, b.foto || null, b.localLat != null ? b.localLat : null, b.localLng != null ? b.localLng : null, b.cidade || null, b.estado || null, b.endereco || null, b.vertenteFeminista || null, b.formacao || null, b.atividades || null, b.dias || null, b.imagens || null, b.videos || null, b.redesSociais || null, b.ownerId || null]
      await client.query(q, params)
    }

    console.log('Blocks done')

    // Insert events
    console.log('\nInserting events')
    for (const e of events){
      // e.data may be stored as ISO string or integer. Attempt to parse
      let dt = null
      if (e.data) {
        dt = new Date(e.data)
        if (isNaN(dt.getTime())) dt = null
      }
      const q = `INSERT INTO "Event"(id, nome, data, descricao, foto, "blocoId", local, cidade, estado, tipo, horario) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (id) DO NOTHING`
      const params = [e.id, e.nome, dt, e.descricao || null, e.foto || null, e.blocoId || null, e.local || null, e.cidade || null, e.estado || null, e.tipo || null, e.horario || null]
      await client.query(q, params)
    }

    console.log('Events done')

    await client.query('COMMIT')
    console.log('\nMigration completed successfully!')

  } catch (err){
    await client.query('ROLLBACK')
    console.error('Error during migration:', err)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(err => { console.error(err); process.exit(1) })
