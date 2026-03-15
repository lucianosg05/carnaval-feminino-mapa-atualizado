import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

function setProvider(provider) {
  let schema = fs.readFileSync(schemaPath, 'utf8');
  schema = schema.replace(/datasource db \{[\s\S]*?\}/m, `datasource db {\n  provider = "${provider}"\n  url      = env("DATABASE_URL")\n}`);
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log(`✅ prisma/schema.prisma updated to provider=${provider}`);
}

function clearPrismaCache() {
  const prismaDir = path.join(process.cwd(), '.prisma');
  const prismaClientDir = path.join(process.cwd(), 'node_modules', '.prisma');
  
  try {
    if (fs.existsSync(prismaDir)) {
      fs.rmSync(prismaDir, { recursive: true, force: true });
      console.log('[CACHE] Cleared .prisma directory');
    }
  } catch (e) {
    console.warn('[CACHE] Could not clear .prisma:', e.message);
  }
}

async function main() {
  const dbUrl = process.env.DATABASE_URL || '';
  const isPostgres = dbUrl.startsWith('postgres') || dbUrl.startsWith('postgresql:');

  console.log(`[SETUP] DATABASE_URL configured: ${isPostgres ? 'PostgreSQL (Neon)' : 'SQLite'}`);
  console.log(`[SETUP] Database URL starts with: ${dbUrl.substring(0, 30)}...`);

  // Clear any cached Prisma files
  clearPrismaCache();

  if (isPostgres) {
    setProvider('postgresql');
  } else {
    setProvider('sqlite');
  }
}

main().catch(err => {
  console.error('[SETUP] Error:', err);
  process.exit(1);
});
