import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
const API_URL = 'https://portal.lumex.host/api'
const API_TOKEN = 'mCSbTETUoTFAUzpOBa4Cx156dGkVHK5F'
const PAGE_SIZE = 100 // Максимальное количество на странице

async function fetchPage(page) {
  const url = `${API_URL}/movies?api_token=${API_TOKEN}&page=${page}&perPage=${PAGE_SIZE}`
  console.log(`📥 Fetching page ${page}: ${url}`)
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`)
  }
  
  const data = await response.json()
  return data.data || []
}

async function sync() {
  try {
    console.log('🚀 Starting full synchronization...')
    
    let page = 1
    let totalAdded = 0
    let hasMore = true

    while (hasMore) {
      console.log(`\n📄 Processing page ${page}...`)
      
      const data = await fetchPage(page)
      
      if (!data || data.length === 0) {
        console.log("✅ No more pages. Synchronization completed!")
        hasMore = false
        break
      }

      let addedThisPage = 0
      let errorsThisPage = 0

      for (const item of data) {
        try {
          await prisma.content.upsert({
            where: { id: item.id },
            update: {
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
            },
            create: {
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
            },
          })
          totalAdded++
          addedThisPage++
          
        } catch (error) {
          errorsThisPage++
          if (errorsThisPage <= 3) {
            console.error(`❌ Error adding item ${item.id}:`, error.message)
          }
        }
      }

      console.log(`✔️ Page ${page}: Added ${addedThisPage}, Errors: ${errorsThisPage}`)
      
      // Если на странице меньше элементов чем PAGE_SIZE, значит это последняя страница
      if (data.length < PAGE_SIZE) {
        console.log("📄 Last page detected (less than PAGE_SIZE items)")
        hasMore = false
      }

      page++
      
      // Пауза между запросами чтобы не нагружать API
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log(`\n🎉 Full synchronization completed!`)
    console.log(`📊 Total records added: ${totalAdded}`)
    
  } catch (error) {
    console.error('❌ Sync failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Добавим обработку сигналов для graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received interrupt signal, shutting down...')
  await prisma.$disconnect()
  process.exit(0)
})

sync()