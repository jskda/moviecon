// scripts/sync-full.js
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
const API_URL = 'https://portal.lumex.host/api'
const API_TOKEN = 'mCSbTETUoTFAUzpOBa4Cx156dGkVHK5F'
const PAGE_SIZE = 50

async function fullSync() {
  try {
    console.log('🚀 Starting FULL synchronization (use for initial setup)...')
    
    // Очищаем таблицу перед полной синхронизацией (осторожно!)
    console.log('🧹 Clearing existing data...')
    await prisma.content.deleteMany({})
    
    let page = 1
    let totalAdded = 0
    let hasMore = true

    while (hasMore && page <= 100) {
      console.log(`📥 Processing page ${page}...`)
      
      const response = await fetch(
        `${API_URL}/movies?api_token=${API_TOKEN}&page=${page}&perPage=${PAGE_SIZE}`
      )
      
      const data = await response.json()
      
      if (!data.data || data.data.length === 0) {
        hasMore = false
        break
      }

      // Пакетная обработка
      const batchPromises = data.data.map(item => 
        prisma.content.create({
          data: {
            id: item.id,
            type: item.type || 'movie',
            title: item.title || item.orig_title,
            ru_title: item.ru_title,
            year: item.year ? new Date(item.year).getFullYear() : null,
            released: item.released,
            kinopoisk_id: item.kinopoisk_id,
            imdb_id: item.imdb_id,
            rating: item.rating,
            iframe_src: item.iframe_src,
            raw: JSON.stringify(item),
          }
        })
      )

      await Promise.allSettled(batchPromises)
      totalAdded += data.data.length

      console.log(`✔️ Page ${page}: Added ${data.data.length} records`)

      if (data.data.length < PAGE_SIZE) {
        hasMore = false
      }

      page++
      
      // Пауза между страницами
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    console.log(`🎉 Full sync completed! Total: ${totalAdded} records`)
    
  } catch (error) {
    console.error('❌ Full sync failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Запуск только если вызван напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  fullSync()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export { fullSync }