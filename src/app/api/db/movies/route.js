import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const page = parseInt(searchParams.get('page') || '1')
    const ordering = 'id' // 'year', 'rating'
    const type = searchParams.get('type')
    
    const prisma = new PrismaClient().$extends(withAccelerate())
    
    const where = type ? { type } : {}
    const [movies, total] = await Promise.all([
      prisma.content.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { [ordering]: 'desc' }
      }),
      prisma.content.count({where})
    ])
    
    return NextResponse.json({
      data: movies,
      total,
      page,
      pages: Math.ceil(total / limit),
      success: true
    })

  } catch (error) {
    console.error('Database error:', error.message)
    return NextResponse.json(
      { 
        error: 'Database error',
        message: error.message,
        success: false
      }, 
      { status: 500 }
    )
  }
}