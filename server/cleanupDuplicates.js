import { Pool } from 'pg';

async function cleanupDuplicates() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to Neon...\n');

    // Show current state
    const beforeResult = await pool.query('SELECT COUNT(*) as count FROM "Block"');
    console.log(`Blocks BEFORE cleanup: ${beforeResult.rows[0].count}\n`);

    // Delete blocks with null ownerId (these are legacy duplicates)
    console.log('Deleting blocks with null ownerId (legacy duplicates)...');
    const deleteResult = await pool.query(`
      DELETE FROM "Block" 
      WHERE "ownerId" IS NULL
    `);
    
    console.log(`Deleted: ${deleteResult.rowCount} blocks\n`);

    // Show final state
    const afterResult = await pool.query('SELECT COUNT(*) as count FROM "Block"');
    console.log(`Blocks AFTER cleanup: ${afterResult.rows[0].count}\n`);

    // Show remaining blocks
    console.log('=== REMAINING BLOCKS ===');
    const remainingBlocks = await pool.query(
      `SELECT id, nome, "ownerId" FROM "Block" LIMIT 30`
    );
    remainingBlocks.rows.forEach((block, idx) => {
      console.log(`${idx + 1}. ${block.nome} (Owner: ${block.ownerId})`);
    });

    console.log('\n✅ Cleanup complete!');
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

cleanupDuplicates();
