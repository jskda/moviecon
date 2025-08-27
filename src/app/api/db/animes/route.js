import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const limit = Number(searchParams.get('limit') || 20)
  const page = Number(searchParams.get('page') || 1)
  const q = searchParams.get('q')

  const where = {
    type: 'ANIMES',
    ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { ru_title: { contains: q, mode: 'insensitive' } }] } : {}),
  }

  const [total, data] = await Promise.all([
    prisma.content.count({ where }),
    prisma.content.findMany({
      where,
      orderBy: { year: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ])

  return Response.json({ data, total, page, pages: Math.ceil(total / limit) })
}