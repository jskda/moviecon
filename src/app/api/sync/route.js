// src/app/api/sync/route.js
import { NextResponse } from 'next/server'
import { incrementalSync } from '@/lib/sync-optimized'

const SYNC_SECRET = process.env.SYNC_SECRET

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    
    if (secret !== SYNC_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Запускаем синхронизацию с таймаутом
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Sync timeout')), 25000)
    )

    const syncResult = await Promise.race([
      incrementalSync(),
      timeoutPromise
    ])

    return NextResponse.json({ 
      success: true, 
      message: `Synchronization completed. Processed ${syncResult.processed} records.`
    })
    
  } catch (error) {
    console.error('Sync API error:', error)
    
    return NextResponse.json({ 
      error: error.message,
      suggestion: 'Try running sync in smaller batches or check API availability'
    }, { status: 500 })
  }
}

// Добавляем поддержку POST для фоновых задач
export async function POST(request) {
  try {
    const { secret } = await request.json()
    
    if (secret !== SYNC_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Для POST запросов запускаем в фоновом режиме
    incrementalSync().catch(console.error)

    return NextResponse.json({ 
      success: true, 
      message: 'Sync started in background' 
    })
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}