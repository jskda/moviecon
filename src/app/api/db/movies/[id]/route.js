import { PrismaClient } from '@prisma/client'
import { parseRawData } from '@/utils/parseRawData'

const prisma = new PrismaClient()

export async function GET(_req, { params }) {
  try {
    const id = Number(params.id)
    console.log('🔍 Fetching movie ID:', id)
    
    const movie = await prisma.content.findUnique({ 
      where: { id }
    })
    
    if (!movie) {
      console.log('❌ Movie not found:', id)
      return Response.json({ error: 'Movie not found' }, { status: 404 })
    }
    
    console.log('✅ Movie found:', movie.ru_title)
    
    // Парсим данные из raw поля
    const parsedMovie = parseRawData(movie)
    
    return Response.json(parsedMovie)
  } catch (error) {
    console.error('❌ Database error:', error)
    return Response.json({ error: 'Database error' }, { status: 500 })
  }
}