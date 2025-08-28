import { PrismaClient } from '@prisma/client'
import { parseRawData } from '@/utils/parseRawData'

const prisma = new PrismaClient()

export async function GET(_req, { params }) {
  const id = Number(params.id)
  
  try {
    const movie = await prisma.content.findUnique({ 
      where: { id }
    })
    
    if (!movie) {
      return Response.json({ error: 'Movie not found' }, { status: 404 })
    }
    
    const parsedMovie = parseRawData(movie)
    
    return Response.json(parsedMovie)
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 })
  }
}