import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const SYNC_SECRET = process.env.SYNC_SECRET

export async function GET(request) {
  try {
    // Проверяем секретный ключ
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    
    if (secret !== SYNC_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prisma = new PrismaClient().$extends(withAccelerate())
    const API_URL = 'https://portal.lumex.host/api'
    const API_TOKEN = 'mCSbTETUoTFAUzpOBa4Cx156dGkVHK5F'
    const PAGE_SIZE = 100

    console.log('🔄 Starting full synchronization...')
    
    let page = 1
    let totalAdded = 0
    let hasMore = true

    while (hasMore && page <= 100) { // Ограничим 100 страницами на всякий случай
      console.log(`📥 Processing page ${page}...`)
      
      const response = await fetch(
        `${API_URL}/movies?api_token=${API_TOKEN}&page=${page}&perPage=${PAGE_SIZE}`
      )
      
      const data = await response.json()
      
      if (!data.data || data.data.length === 0) {
        console.log("✅ No more pages.")
        hasMore = false
        break
      }

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
          console.error(`Error with item ${item.id}:`, error.message)
        }
      }

      // Если на странице меньше элементов, значит это последняя страница
      if (data.data.length < PAGE_SIZE) {
        hasMore = false
      }

      page++
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    console.log(`✅ Full sync completed! Added ${totalAdded} records`)
    
    return NextResponse.json({ 
      success: true, 
      message: `Full synchronization completed. Added ${totalAdded} records.`,
      total: totalAdded
    })
    
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}