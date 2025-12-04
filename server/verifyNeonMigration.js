import { Pool } from 'pg';

async function verifyNeon() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to Neon...\n');

    // Count records
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM "User"');
    const blocksResult = await pool.query('SELECT COUNT(*) as count FROM "Block"');
    const eventsResult = await pool.query('SELECT COUNT(*) as count FROM "Event"');

    const userCount = parseInt(usersResult.rows[0].count, 10);
    const blockCount = parseInt(blocksResult.rows[0].count, 10);
    const eventCount = parseInt(eventsResult.rows[0].count, 10);

    console.log(`=== RECORD COUNTS ===`);
    console.log(`Users: ${userCount}`);
    console.log(`Blocks: ${blockCount}`);
    console.log(`Events: ${eventCount}\n`);

    // Sample blocks with details
    console.log('=== SAMPLE BLOCKS (with details) ===');
    const sampleBlocks = await pool.query(
      `SELECT id, nome, "ownerId", foto, endereco, formacao, "vertenteFeminista" 
       FROM "Block" 
       LIMIT 5`
    );
    sampleBlocks.rows.forEach((block, idx) => {
      console.log(`${idx + 1}. ${block.nome}`);
      console.log(`   ID: ${block.id}`);
      console.log(`   Owner: ${block.ownerId}`);
      console.log(`   Foto: ${block.foto ? 'YES' : 'NO'}`);
      console.log(`   Endereco: ${block.endereco ? 'YES' : 'NO'}`);
      console.log(`   Formacao: ${block.formacao ? 'YES' : 'NO'}`);
      console.log(`   VertenteFeminista: ${block.vertenteFeminista ? 'YES' : 'NO'}\n`);
    });

    // Check for blocks with missing critical fields
    console.log('=== DATA COMPLETENESS CHECK ===');
    const missingEnderecoResult = await pool.query(
      `SELECT COUNT(*) as count FROM "Block" WHERE endereco IS NULL OR endereco = ''`
    );
    const missingFotoResult = await pool.query(
      `SELECT COUNT(*) as count FROM "Block" WHERE foto IS NULL`
    );
    const missingFormacaoResult = await pool.query(
      `SELECT COUNT(*) as count FROM "Block" WHERE formacao IS NULL OR formacao = ''`
    );

    console.log(`Blocks missing endereco: ${missingEnderecoResult.rows[0].count}`);
    console.log(`Blocks missing foto: ${missingFotoResult.rows[0].count}`);
    console.log(`Blocks missing formacao: ${missingFormacaoResult.rows[0].count}\n`);

    // Owner distribution
    console.log('=== OWNER DISTRIBUTION ===');
    const ownerDist = await pool.query(
      `SELECT "ownerId", COUNT(*) as count FROM "Block" GROUP BY "ownerId" ORDER BY count DESC`
    );
    ownerDist.rows.forEach(row => {
      console.log(`  OwnerID ${row.ownerId}: ${row.count} blocks`);
    });

    console.log('\n✅ Verification complete!');
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

verifyNeon();
