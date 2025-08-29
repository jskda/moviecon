// lib/sync-optimized.js
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
const API_URL = 'https://portal.lumex.host/api'
const API_TOKEN = 'mCSbTETUoTFAUzpOBa4Cx156dGkVHK5F'
const PAGE_SIZE = 50

export async function incrementalSync() {
  try {
    console.log('🔄 Starting incremental synchronization...')
    
    // Получаем время последней успешной синхронизации
    const lastSync = await prisma.syncLog.findFirst({
      where: { success: true },
      orderBy: { completedAt: 'desc' },
      select: { completedAt: true }
    })

    const lastSyncTime = lastSync?.completedAt || new Date(0)
    
    let page = 1
    let totalProcessed = 0
    let hasMore = true

    while (hasMore && page <= 50) {
      console.log(`📥 Processing page ${page}...`)
      
      const response = await fetch(
        `${API_URL}/movies?api_token=${API_TOKEN}&page=${page}&perPage=${PAGE_SIZE}`
      )
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.data || data.data.length === 0) {
        hasMore = false
        break
      }

      // Пакетная обработка элементов
      const batchPromises = data.data.map(item => 
        prisma.content.upsert({
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
      )

      // Выполняем все операции параллельно
      const results = await Promise.allSettled(batchPromises)
      totalProcessed += data.data.length

      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length

      console.log(`✔️ Page ${page}: ${successful} success, ${failed} failed`)

      if (data.data.length < PAGE_SIZE) {
        hasMore = false
      }

      page++
    }

    // Логируем успешную синхронизацию
    await prisma.syncLog.create({
      data: {
        type: 'incremental',
        itemsSynced: totalProcessed,
        success: true,
        completedAt: new Date()
      }
    })

    console.log(`✅ Incremental sync completed! Processed ${totalProcessed} records`)
    return { success: true, processed: totalProcessed }

  } catch (error) {
    console.error('❌ Sync error:', error)
    
    await prisma.syncLog.create({
      data: {
        type: 'incremental',
        itemsSynced: 0,
        success: false,
        completedAt: new Date()
      }
    })
    
    throw error
  } finally {
    await prisma.$disconnect()
  }
}