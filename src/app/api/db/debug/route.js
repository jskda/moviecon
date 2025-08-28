import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const totalCount = await prisma.content.count()
    const allContent = await prisma.content.findMany({
      take: 20,
      orderBy: { id: 'asc' },
      select: { id: true, type: true, ru_title: true, title: true }
    })
    const types = await prisma.content.groupBy({
      by: ['type'],
      _count: { id: true }
    })
    return Response.json({
      total_count: totalCount,
      content_types: types,
      first_20_items: allContent,
      message: 'Database content overview'
    })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}