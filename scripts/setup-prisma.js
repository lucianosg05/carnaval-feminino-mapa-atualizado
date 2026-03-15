import fs from 'fs';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

// Simple schema validation - doesn't modify anything
function validateSchema() {
  try {
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      if (!schema.includes('datasource db')) {
        console.error('❌ Invalid schema: missing datasource db block');
        process.exit(1);
      }
      console.log('✅ prisma/schema.prisma is valid');
    } else {
      console.error('❌ prisma/schema.prisma not found');
      process.exit(1);
    }
  } catch (e) {
    console.error('[SETUP] Error:', e.message);
    process.exit(1);
  }
}

function clearPrismaCache() {
  const prismaDir = path.join(process.cwd(), '.prisma');
  
  try {
    if (fs.existsSync(prismaDir)) {
      fs.rmSync(prismaDir, { recursive: true, force: true });
      console.log('[CACHE] Cleared .prisma directory');
    }
  } catch (e) {
    console.warn('[CACHE] Could not clear .prisma:', e.message);
  }
}

const main = () => {
  const dbUrl = process.env.DATABASE_URL || '';
  const isPostgres = dbUrl.startsWith('postgres') || dbUrl.startsWith('postgresql:');
  const provider = isPostgres ? 'PostgreSQL (Neon)' : 'SQLite';

  console.log(`[SETUP] Database provider: ${provider}`);
  clearPrismaCache();
  validateSchema();
};

main();
