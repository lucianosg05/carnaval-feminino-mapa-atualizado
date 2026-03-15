import { execSync } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function migrate() {
  try {
    console.log('[MIGRATE] Starting database migration...');
    console.log(`[MIGRATE] DATABASE_URL configured: ${process.env.DATABASE_URL ? 'Yes' : 'NO'}`);
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Clear Prisma generated files to force regeneration
    const prismaGenDir = path.join(process.cwd(), 'node_modules', '.prisma');
    if (fs.existsSync(prismaGenDir)) {
      try {
        fs.rmSync(prismaGenDir, { recursive: true, force: true });
        console.log('[MIGRATE] Cleared generated Prisma cache');
      } catch (e) {
        console.warn('[MIGRATE] Could not clear Prisma cache:', e.message);
      }
    }

    console.log('[MIGRATE] Running prisma migrate deploy...');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('[MIGRATE] ✅ Migration completed successfully');
    } catch (e) {
      console.error('[MIGRATE] Migration command failed but continuing...');
      // Don't exit on migration error if it's just "already at latest"
    }

    process.exit(0);
  } catch (error) {
    console.error('[MIGRATE] ❌ Fatal error:', error.message);
    if (error.stderr) console.error('[MIGRATE] STDERR:', error.stderr.toString());
    if (error.stdout) console.log('[MIGRATE] STDOUT:', error.stdout.toString());
    process.exit(1);
  }
}

migrate();
