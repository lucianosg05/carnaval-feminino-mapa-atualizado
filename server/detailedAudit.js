import prisma from './prismaClient.js'

async function detailedAudit() {
  try {
    console.log('\n📋 AUDITORIA DETALHADA DE BLOCOS\n')
    
    const blocks = await prisma.block.findMany({
      select: {
        id: true,
        nome: true,
        endereco: true,
        formacao: true,
        vertenteFeminista: true,
        foto: true
      },
      orderBy: { nome: 'asc' }
    })

    console.log('🔴 BLOCOS SEM ENDEREÇO (27):')
    const noEndereco = blocks.filter(b => !b.endereco || b.endereco.trim() === '')
    console.log(`   Todos os ${noEndereco.length} blocos estão sem endereço completo!\n`)

    console.log('🟡 BLOCOS SEM FORMAÇÃO (1):')
    const noFormacao = blocks.filter(b => !b.formacao || b.formacao.trim() === '')
    noFormacao.forEach(b => {
      console.log(`   - ${b.nome}`)
    })

    console.log('\n🟡 BLOCOS SEM VERTENTE FEMINISTA (1):')
    const noVertente = blocks.filter(b => !b.vertenteFeminista || b.vertenteFeminista.trim() === '')
    noVertente.forEach(b => {
      console.log(`   - ${b.nome}`)
    })

    console.log('\n🟠 BLOCOS SEM FOTO PRINCIPAL (19):')
    const noFoto = blocks.filter(b => !b.foto || b.foto.trim() === '')
    console.log(`   ${noFoto.length} blocos sem foto principal`)
    noFoto.slice(0, 5).forEach(b => {
      console.log(`   - ${b.nome}`)
    })
    if (noFoto.length > 5) {
      console.log(`   ... e mais ${noFoto.length - 5}`)
    }

    console.log('\n\n✅ RESUMO DE PRIORIDADES:')
    console.log('1. ⚠️  Adicionar ENDEREÇO em todos os 27 blocos (CRÍTICO)')
    console.log('2. 🟡 Adicionar FORMAÇÃO no bloco:', noFormacao[0]?.nome)
    console.log('3. 🟡 Adicionar VERTENTE FEMINISTA no bloco:', noVertente[0]?.nome)
    console.log('4. 🟠 Adicionar FOTO PRINCIPAL em 19 blocos (importante para a experiência)')

  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

detailedAudit()
