import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  try {
    console.log('[MIGRATE] Starting database migration...');
    console.log(`[MIGRATE] DATABASE_URL configured: ${process.env.DATABASE_URL ? 'Yes' : 'NO'}`);
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    console.log('[MIGRATE] Running prisma migrate deploy...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    console.log('[MIGRATE] ✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('[MIGRATE] ❌ Migration failed:', error.message);
    if (error.stderr) console.error('[MIGRATE] STDERR:', error.stderr.toString());
    if (error.stdout) console.log('[MIGRATE] STDOUT:', error.stdout.toString());
    process.exit(1);
  }
}

migrate();
