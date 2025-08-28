import { PrismaClient } from '@prisma/client'
import { parseRawData } from '@/utils/parseRawData'

const prisma = new PrismaClient()

export async function GET(_req, { params }) {
  try {
    const { id } = await params
    const movieId = Number(id)
    
    console.log('🔍 Fetching movie ID:', movieId)

    const movie = await prisma.content.findUnique({ 
      where: { id: movieId }
    })
    
    if (!movie) {
      console.log('❌ Movie not found:', movieId)
      return Response.json({ error: 'Movie not found' }, { status: 404 })
    }
    
    console.log('✅ Movie found:', movie.ru_title)
    
    const parsedMovie = parseRawData(movie)
    
    return Response.json(parsedMovie)
  } catch (error) {
    console.error('❌ Database error:', error)
    return Response.json({ error: 'Database error' }, { status: 500 })
  }
}