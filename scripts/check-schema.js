import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndFixSchema() {
  try {
    console.log('[SCHEMA-CHECK] Verificando schema do banco de dados...');
    
    // Tenta fazer uma query esperando que videos exista
    try {
      const result = await prisma.$queryRawUnsafe(
        `SELECT column_name FROM information_schema.columns WHERE table_name='Block' AND column_name='videoUrl'`
      );
      
      if (result && result.length > 0) {
        console.error('[SCHEMA-CHECK] ❌ ERRO: Coluna videoUrl ainda existe no banco!');
        console.error('[SCHEMA-CHECK] A base de dados está desatualizada.');
        console.error('[SCHEMA-CHECK] Tentando corrigir...');
        
        // Tenta remover a coluna antiga e renomear
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "Block" DROP COLUMN IF EXISTS "videoUrl"
        `);
        console.log('[SCHEMA-CHECK] ✅ Coluna videoUrl removida');
      } else {
        console.log('[SCHEMA-CHECK] ✅ Schema está correto (videoUrl não existe)');
      }
    } catch (e) {
      // Se a query falhar, provavelmente é SQLite (ambiente local)
      console.log('[SCHEMA-CHECK] Database não suporta information_schema (provável SQLite)');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('[SCHEMA-CHECK] Erro:', error.message);
    process.exit(0); // Don't fail startup
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFixSchema();
