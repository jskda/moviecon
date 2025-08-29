import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const page = parseInt(searchParams.get('page') || '1')
    const ordering = searchParams.get('ordering') || 'createdAt'
    const type = searchParams.get('type')
    const q = searchParams.get('q')

    const prisma = new PrismaClient().$extends(withAccelerate())

    // Базовые условия
    const where = type ? { type } : {}
    
    // Добавляем поиск если есть
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { ru_title: { contains: q, mode: 'insensitive' } }
      ]
    }

    const [movies, total] = await Promise.all([
      prisma.content.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { [ordering]: 'desc' }
      }),
      prisma.content.count({ where })
    ])

    return NextResponse.json({
      data: movies,
      total,
      page,
      pages: Math.ceil(total / limit),
      success: true
    })

  } catch (error) {
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