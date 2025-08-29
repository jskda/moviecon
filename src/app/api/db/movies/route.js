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

    // Упрощенный where для Accelerate
    let where = {}
    
    if (type) {
      where.type = type
    }
    
    // Prisma Accelerate не поддерживает сложные фильтры like/contains
    // Поэтому пока уберем поиск или сделаем его на клиенте
    if (q) {
      // Простой фильтр по точному совпадению (работает в Accelerate)
      where.OR = [
        { title: q },
        { ru_title: q },
        { imdb_id: q },
        { kinopoisk_id: parseInt(q) || undefined }
      ].filter(condition => Object.values(condition)[0] !== undefined)
    }

    const [movies, total] = await Promise.all([
      prisma.content.findMany({
        where: Object.keys(where).length > 0 ? where : undefined,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { [ordering]: 'desc' }
      }),
      prisma.content.count({
        where: Object.keys(where).length > 0 ? where : undefined
      })
    ])

    // Если нужен поиск, фильтруем на стороне сервера после получения
    let filteredMovies = movies
    if (q && filteredMovies.length > 0) {
      filteredMovies = movies.filter(movie => 
        movie.title?.toLowerCase().includes(q.toLowerCase()) ||
        movie.ru_title?.toLowerCase().includes(q.toLowerCase()) ||
        movie.imdb_id?.includes(q) ||
        movie.kinopoisk_id?.toString().includes(q)
      )
    }

    return NextResponse.json({
      data: filteredMovies,
      total: filteredMovies.length, // Или total для пагинации
      page,
      pages: Math.ceil((Object.keys(where).length > 0 ? filteredMovies.length : total) / limit),
      success: true
    })

  } catch (error) {
    console.error('Database error:', error)
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