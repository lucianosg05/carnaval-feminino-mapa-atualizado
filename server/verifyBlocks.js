import prisma from './prismaClient.js'

async function verifyBlocks() {
  try {
    console.log('Verificando estado dos blocos...\n')
    
    // Contar blocos por ownerId
    const allBlocks = await prisma.block.findMany({
      select: { id: true, nome: true, ownerId: true }
    })
    
    const grouped = {}
    allBlocks.forEach(block => {
      const owner = block.ownerId || 'null'
      if (!grouped[owner]) {
        grouped[owner] = []
      }
      grouped[owner].push(block.nome)
    })
    
    console.log(`Total de blocos: ${allBlocks.length}\n`)
    
    Object.entries(grouped).forEach(([owner, blocos]) => {
      console.log(`Owner: ${owner || 'NULL'}`)
      console.log(`Quantidade: ${blocos.length} blocos`)
      console.log('Amostra:')
      blocos.slice(0, 3).forEach(nome => {
        console.log(`  - ${nome}`)
      })
      console.log()
    })
    
    // Verificar se lsoares20357@gmail.com está com blocos
    const userBlocks = await prisma.block.findMany({
      where: { ownerId: 'O2yjpR72auN6xZQ5meI0nnnVYLY2' },
      select: { nome: true }
    })
    
    console.log(`Blocos de lsoares20357@gmail.com (UID: O2yjpR72auN6xZQ5meI0nnnVYLY2): ${userBlocks.length}`)
    
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyBlocks()
