import prisma from './prismaClient.js'
import { uploadToCloudinary, isCloudinaryConfigured } from './cloudinaryHelper.js'
import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Download a file from URL and return buffer
 */
async function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    protocol.get(url, (res) => {
      let data = Buffer.alloc(0)
      res.on('data', (chunk) => {
        data = Buffer.concat([data, chunk])
      })
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

/**
 * Check if URL is a local/localhost URL
 */
function isLocalUrl(url) {
  return url && (url.includes('localhost') || url.includes('/uploads') || url.startsWith('/'))
}

/**
 * Migrate all photos from local URLs to Cloudinary
 */
async function migratePhotosToCloudinary() {
  if (!isCloudinaryConfigured()) {
    console.error('❌ Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.')
    process.exit(1)
  }

  console.log('🚀 Starting photo migration to Cloudinary...')

  try {
    // Get all blocks with photos
    const blocks = await prisma.block.findMany({
      where: {
        foto: { not: null }
      }
    })

    console.log(`📦 Found ${blocks.length} blocks with photos`)

    let migratedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const block of blocks) {
      if (!block.foto) continue

      const isLocal = isLocalUrl(block.foto)
      if (!isLocal) {
        console.log(`✅ SKIP - ${block.id}: ${block.nome} - already using Cloudinary`)
        skippedCount++
        continue
      }

      try {
        console.log(`\n🔄 Migrating block: ${block.nome} (ID: ${block.id})`)
        console.log(`   Current photo URL: ${block.foto}`)

        // Download or read local file
        let buffer
        if (block.foto.includes('localhost')) {
          // Remote local URL (shouldn't happen in prod, but handle it)
          console.log(`   ⚠️  Skipping remote local URL (cannot download): ${block.foto}`)
          skippedCount++
          continue
        } else if (block.foto.startsWith('/uploads/')) {
          // Local file path
          const filename = block.foto.replace('/uploads/', '')
          const filepath = path.join(__dirname, 'uploads', filename)
          if (fs.existsSync(filepath)) {
            buffer = fs.readFileSync(filepath)
            console.log(`   📂 Read local file: ${filename}`)
          } else {
            console.log(`   ❌ Local file not found: ${filepath}`)
            errorCount++
            continue
          }
        } else {
          console.log(`   ⚠️  Unknown URL format: ${block.foto}`)
          errorCount++
          continue
        }

        // Upload to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(buffer, 'carnaval-blocos/fotos')
        console.log(`   ☁️  Uploaded to Cloudinary: ${cloudinaryUrl}`)

        // Update database
        await prisma.block.update({
          where: { id: block.id },
          data: { foto: cloudinaryUrl }
        })
        console.log(`   ✅ Database updated`)

        migratedCount++
      } catch (error) {
        console.error(`   ❌ Error migrating ${block.id}: ${error.message}`)
        errorCount++
      }
    }

    // Also migrate event photos
    console.log('\n📅 Migrating event photos...')
    const events = await prisma.event.findMany({
      where: {
        foto: { not: null }
      }
    })

    console.log(`📦 Found ${events.length} events with photos`)

    let eventsMigratedCount = 0
    let eventsSkippedCount = 0
    let eventsErrorCount = 0

    for (const event of events) {
      if (!event.foto) continue

      const isLocal = isLocalUrl(event.foto)
      if (!isLocal) {
        console.log(`✅ SKIP - ${event.id}: already using Cloudinary`)
        eventsSkippedCount++
        continue
      }

      try {
        console.log(`\n🔄 Migrating event: ${event.nome} (ID: ${event.id})`)

        let buffer
        if (event.foto.startsWith('/uploads/')) {
          const filename = event.foto.replace('/uploads/', '')
          const filepath = path.join(__dirname, 'uploads', filename)
          if (fs.existsSync(filepath)) {
            buffer = fs.readFileSync(filepath)
          } else {
            console.log(`   ❌ Local file not found`)
            eventsErrorCount++
            continue
          }
        } else {
          console.log(`   ⚠️  Unknown URL format`)
          eventsErrorCount++
          continue
        }

        const cloudinaryUrl = await uploadToCloudinary(buffer, 'carnaval-eventos/fotos')
        console.log(`   ☁️  Uploaded to Cloudinary: ${cloudinaryUrl}`)

        await prisma.event.update({
          where: { id: event.id },
          data: { foto: cloudinaryUrl }
        })
        console.log(`   ✅ Database updated`)

        eventsMigratedCount++
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`)
        eventsErrorCount++
      }
    }

    // Summary
    console.log(`\n📊 Migration Summary:`)
    console.log(`  Blocks:`)
    console.log(`    ✅ Migrated: ${migratedCount}`)
    console.log(`    ⏭️  Skipped:  ${skippedCount}`)
    console.log(`    ❌ Errors:   ${errorCount}`)
    console.log(`  Events:`)
    console.log(`    ✅ Migrated: ${eventsMigratedCount}`)
    console.log(`    ⏭️  Skipped:  ${eventsSkippedCount}`)
    console.log(`    ❌ Errors:   ${eventsErrorCount}`)
    console.log(`\n✨ Migration complete!`)

    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('Fatal error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

// Run migration
migratePhotosToCloudinary()
