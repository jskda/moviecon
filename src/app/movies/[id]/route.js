import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_req, { params }) {
  const id = Number(params.id)
  const movie = await prisma.content.findUnique({ where: { id } })
  if (!movie || movie.type !== 'MOVIE') {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
  return Response.json(movie)
}