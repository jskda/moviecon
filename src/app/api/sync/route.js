import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

// Создаем защитный ключ для API
const SYNC_SECRET = process.env.SYNC_SECRET
export async function GET(request) {
  try {
    // Проверяем что переменные окружения установлены
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'DATABASE_URL not configured' }, 
        { status: 500 }
      )
    }

    const { PrismaClient } = await import('@prisma/client/edge')
    const { withAccelerate } = await import('@prisma/extension-accelerate')
    
    const prisma = new PrismaClient().$extends(withAccelerate())
    
    console.log('🔄 Starting synchronization...')
    
    // Ваша логика синхронизации здесь
    const API_URL = 'https://portal.lumex.host/api'
    const API_TOKEN = 'mCSbTETUoTFAUzpOBa4Cx156dGkVHK5F'
    
    let page = 1
    let totalAdded = 0
    
    while (page <= 5) { // Ограничим 5 страницами для начала
      console.log(`📥 Fetching page ${page}...`)
      
      const response = await fetch(
        `${API_URL}/movies?api_token=${API_TOKEN}&page=${page}&perPage=50`
      )
      
      const data = await response.json()
      
      if (!data.data || data.data.length === 0) break
      
      for (const item of data.data) {
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
        } catch (error) {
          console.error(`❌ Error with item ${item.id}:`, error.message)
        }
      }
      
      page++
      // Пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    console.log(`✅ Sync completed! Added ${totalAdded} records`)
    
    return NextResponse.json({ 
      success: true, 
      message: `Synchronization completed. Added ${totalAdded} records.` 
    })
    
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}