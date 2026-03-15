import fs from 'fs';
import path from 'path';

function cleanPrismaClient() {
  const dirs = [
    path.join(process.cwd(), '.prisma'),
    path.join(process.cwd(), 'node_modules', '.prisma'),
    path.join(process.cwd(), 'node_modules', '@prisma', 'client')
  ];

  for (const dir of dirs) {
    try {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`[CLEAN] Removed: ${dir}`);
      }
    } catch (e) {
      console.warn(`[CLEAN] Could not remove ${dir}: ${e.message}`);
    }
  }

  console.log('[CLEAN] Cache cleaned successfully');
  process.exit(0);
}

cleanPrismaClient();
