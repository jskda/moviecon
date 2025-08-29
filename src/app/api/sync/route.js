import { NextResponse } from 'next/server'

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
    
    // Остальная логика синхронизации...
    
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}