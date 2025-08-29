import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export async function GET(request) {
  try {
    console.log('API Request received')
    
    const prisma = new PrismaClient().$extends(withAccelerate())
    console.log('Prisma client created')
    
    // Простой тестовый запрос
    const movies = await prisma.content.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('Movies found:', movies.length)
    
    return NextResponse.json({
      data: movies,
      total: movies.length,
      page: 1,
      pages: 1,
      success: true
    })

  } catch (error) {
    console.error('FULL ERROR:', error)
    return NextResponse.json(
      { 
        error: 'Database error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        success: false
      }, 
      { status: 500 }
    )
  }
}