import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const defaultPaths = [path.join(process.cwd(), 'prisma', 'dev.db'), path.join(process.cwd(), 'dev.db')]
const sqlitePath = process.env.SQLITE_PATH || defaultPaths.find(p => fs.existsSync(p))

if (!sqlitePath) {
  console.error('No sqlite DB found at default paths:', defaultPaths.join(', '))
  process.exit(1)
}

const db = new Database(sqlitePath, { readonly: true });

function safeCount(sql){
  try{
    const r = db.prepare(sql).get();
    return r ? Object.values(r)[0] : 0;
  } catch(e){
    return 0;
  }
}

const users = safeCount('SELECT COUNT(*) as c FROM "User"');
const blocks = safeCount('SELECT COUNT(*) as c FROM "Block"');
const events = safeCount('SELECT COUNT(*) as c FROM "Event"');

console.log('SQLite path:', sqlitePath);
console.log('Counts: Users=', users, 'Blocks=', blocks, 'Events=', events);

const sample = db.prepare('SELECT id, nome, ownerId FROM "Block" LIMIT 10').all();
console.log('\nSample blocks:');
sample.forEach(b => console.log(` - ${b.nome} (id=${b.id}, owner=${b.ownerId})`));

db.close();
