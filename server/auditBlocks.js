import prisma from './prismaClient.js'

async function auditBlocks() {
  try {
    console.log('🔍 Auditoria de Blocos Feministas\n')
    console.log('=' .repeat(80))
    
    const blocks = await prisma.block.findMany({
      select: {
        id: true,
        nome: true,
        descricao: true,
        contato: true,
        cidade: true,
        estado: true,
        endereco: true,
        formacao: true,
        vertenteFeminista: true,
        localLat: true,
        localLng: true,
        redesSociais: true,
        atividades: true,
        dias: true,
        foto: true,
        imagens: true,
        videos: true
      }
    })

    console.log(`\n📊 RESUMO GERAL`)
    console.log(`Total de blocos: ${blocks.length}\n`)

    // Campos obrigatórios (core)
    const requiredFields = ['nome', 'contato', 'cidade', 'estado']
    
    // Campos recomendados (bom ter)
    const recommendedFields = ['descricao', 'endereco', 'formacao', 'vertenteFeminista', 'atividades', 'dias']
    
    // Campos de mídia
    const mediaFields = ['foto', 'imagens', 'videos']
    
    // Campos de localização
    const locationFields = ['localLat', 'localLng']

    // Estatísticas globais
    const stats = {
      required: {},
      recommended: {},
      media: {},
      location: {}
    }

    requiredFields.forEach(field => {
      stats.required[field] = blocks.filter(b => !b[field] || b[field].toString().trim() === '').length
    })

    recommendedFields.forEach(field => {
      stats.recommended[field] = blocks.filter(b => !b[field] || b[field].toString().trim() === '').length
    })

    mediaFields.forEach(field => {
      if (field === 'imagens' || field === 'videos') {
        stats.media[field] = blocks.filter(b => !Array.isArray(b[field]) || b[field].length === 0).length
      } else {
        stats.media[field] = blocks.filter(b => !b[field] || b[field].toString().trim() === '').length
      }
    })

    locationFields.forEach(field => {
      stats.location[field] = blocks.filter(b => b[field] === null || b[field] === undefined).length
    })

    console.log('📌 CAMPOS OBRIGATÓRIOS:')
    Object.entries(stats.required).forEach(([field, count]) => {
      const percent = (count / blocks.length * 100).toFixed(1)
      const status = count === 0 ? '✅' : '⚠️ '
      console.log(`  ${status} ${field}: ${blocks.length - count}/${blocks.length} (${100 - parseFloat(percent)}% completo)`)
    })

    console.log('\n💡 CAMPOS RECOMENDADOS:')
    Object.entries(stats.recommended).forEach(([field, count]) => {
      const percent = (count / blocks.length * 100).toFixed(1)
      const status = count === 0 ? '✅' : '❌'
      console.log(`  ${status} ${field}: ${blocks.length - count}/${blocks.length} (${100 - parseFloat(percent)}% completo)`)
    })

    console.log('\n🖼️ CAMPOS DE MÍDIA:')
    Object.entries(stats.media).forEach(([field, count]) => {
      const percent = (count / blocks.length * 100).toFixed(1)
      const status = count === 0 ? '✅' : '❌'
      console.log(`  ${status} ${field}: ${blocks.length - count}/${blocks.length} (${100 - parseFloat(percent)}% com conteúdo)`)
    })

    console.log('\n📍 CAMPOS DE LOCALIZAÇÃO:')
    Object.entries(stats.location).forEach(([field, count]) => {
      const percent = (count / blocks.length * 100).toFixed(1)
      const status = count === 0 ? '✅' : '❌'
      console.log(`  ${status} ${field}: ${blocks.length - count}/${blocks.length} (${100 - parseFloat(percent)}% completo)`)
    })

    // Lista de blocos com problemas
    console.log('\n\n' + '='.repeat(80))
    console.log('🚨 BLOCOS COM CAMPOS FALTANDO:\n')

    const problematicBlocks = blocks.filter(b => {
      const hasAllRequired = requiredFields.every(f => b[f] && b[f].toString().trim() !== '')
      return !hasAllRequired
    })

    if (problematicBlocks.length === 0) {
      console.log('✅ Todos os blocos têm os campos obrigatórios preenchidos!')
    } else {
      problematicBlocks.forEach((block, idx) => {
        console.log(`${idx + 1}. ${block.nome}`)
        requiredFields.forEach(field => {
          if (!block[field] || block[field].toString().trim() === '') {
            console.log(`   ❌ ${field}: VAZIO`)
          }
        })
        console.log()
      })
    }

    // Blocos incompletos (sem dados recomendados)
    console.log('='.repeat(80))
    console.log('ℹ️ BLOCOS INCOMPLETOS (faltam dados recomendados):\n')

    const incompleteBlocks = blocks.filter(b => {
      const filledRecommended = recommendedFields.filter(f => b[f] && b[f].toString().trim() !== '').length
      return filledRecommended < recommendedFields.length / 2 // Menos de 50% dos recomendados
    })

    if (incompleteBlocks.length === 0) {
      console.log('✅ Todos os blocos têm dados recomendados suficientes!')
    } else {
      incompleteBlocks.forEach((block, idx) => {
        const filledFields = recommendedFields.filter(f => b[f] && b[f].toString().trim() !== '')
        console.log(`${idx + 1}. ${block.nome}: ${filledFields.length}/${recommendedFields.length} campos recomendados`)
        recommendedFields.forEach(field => {
          if (!block[field] || block[field].toString().trim() === '') {
            console.log(`   ○ ${field}`)
          }
        })
        console.log()
      })
    }

    console.log('='.repeat(80))
    console.log('✅ Auditoria concluída!')

  } catch (error) {
    console.error('Erro:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

auditBlocks()
