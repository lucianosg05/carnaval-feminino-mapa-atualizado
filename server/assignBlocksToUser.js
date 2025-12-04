import prisma from './prismaClient.js'

// Email do proprietário que deve ser atribuído
const OWNER_EMAIL = 'lsoares20357@gmail.com'
const OWNER_ID = 'O2yjpR72auN6xZQ5meI0nnnVYLY2' // Firebase UID confirmado anteriormente

async function assignBlocksToUser() {
  try {
    console.log(`Atribuindo blocos orfãos para ${OWNER_EMAIL}...`)
    
    // Encontrar blocos com ownerId null
    const orphanedBlocks = await prisma.block.findMany({
      where: { ownerId: null }
    })
    
    console.log(`Encontrados ${orphanedBlocks.length} blocos orfãos`)
    
    if (orphanedBlocks.length === 0) {
      console.log('Nenhum bloco órfão para atribuir')
      return
    }
    
    // Atribuir todos os blocos orfãos para o usuário
    const updated = await prisma.block.updateMany({
      where: { ownerId: null },
      data: { ownerId: OWNER_ID }
    })
    
    console.log(`✅ ${updated.count} blocos atribuídos com sucesso para ${OWNER_EMAIL}`)
    console.log(`   ownerId: ${OWNER_ID}`)
    
    // Verificar resultado
    const allBlocks = await prisma.block.findMany({
      where: { ownerId: OWNER_ID },
      select: { id: true, nome: true, ownerId: true }
    })
    
    console.log(`\nTotal de blocos agora pertencentes a ${OWNER_EMAIL}: ${allBlocks.count || allBlocks.length}`)
    console.log('Primeiros 5 blocos:')
    allBlocks.slice(0, 5).forEach(block => {
      console.log(`  - ${block.nome} (${block.id})`)
    })
    
  } catch (error) {
    console.error('Erro ao atribuir blocos:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

assignBlocksToUser()
