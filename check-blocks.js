import prisma from './server/prismaClient.js'

async function main() {
  try {
    const count = await prisma.block.count()
    console.log(`Total de blocos no banco: ${count}`)
    
    if (count > 0) {
      const blocks = await prisma.block.findMany({ select: { id: true, nome: true, cidade: true, estado: true } })
      console.log('\nBlocos encontrados:')
      blocks.forEach(b => console.log(`  - ${b.nome} (${b.cidade}, ${b.estado})`))
    } else {
      console.log('\n❌ Nenhum bloco encontrado no banco de dados!')
      console.log('\nExecute o seed: node server/seedBlocks.js')
    }
  } catch (error) {
    console.error('Erro ao conectar ao banco:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
