import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Math.min(Number(searchParams.get('limit') || 20), 100)
    const page = Number(searchParams.get('page') || 1)
    const ordering = searchParams.get('ordering') || 'created'
    const direction = searchParams.get('direction') || 'desc'

    let orderBy = {}
    switch (ordering) {
      case 'rating':
        orderBy = { rating: direction }
        break
      case 'year':
        orderBy = { year: direction }
        break
      case 'title':
        orderBy = { title: direction }
        break
      case 'created':
      default:
        orderBy = { createdAt: direction }
    }

    const where = {
      type: 'movie'
    }

    const [total, data] = await Promise.all([
      prisma.content.count({ where }),
      prisma.content.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    const pages = Math.ceil(total / limit)

    return Response.json({ 
      data, 
      total, 
      page, 
      pages,
      result: true 
    })
  } catch (error) {
    return Response.json({ 
      error: 'Database error', 
      result: false 
    }, { status: 500 })
  }
}