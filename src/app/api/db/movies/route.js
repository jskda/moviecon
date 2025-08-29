import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export async function GET(request) {
  try {
    console.log('🎬 API Movies Request received')
    
    const prisma = new PrismaClient().$extends(withAccelerate())
    console.log('✅ Prisma client connected')
    
    const movies = await prisma.content.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`✅ Found ${movies.length} movies`)
    
    return NextResponse.json({
      data: movies,
      total: movies.length,
      page: 1,
      pages: 1,
      success: true
    })

  } catch (error) {
    console.error('❌ Database error:', error.message)
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