// import { PrismaClient } from '@prisma/client'
// import { parseRawData } from '@/utils/parseRawData'

// const prisma = new PrismaClient()

// export async function GET(_req, { params }) {
//   try {
//     const { id } = await params
//     const movieId = Number(id)
    
//     console.log('🔍 Fetching movie ID:', movieId)

//     const movie = await prisma.content.findUnique({ 
//       where: { id: movieId }
//     })
    
//     if (!movie) {
//       console.log('❌ Movie not found:', movieId)
//       return Response.json({ error: 'Movie not found' }, { status: 404 })
//     }
    
//     console.log('✅ Movie found:', movie.ru_title)
    
//     const parsedMovie = parseRawData(movie)
    
//     return Response.json(parsedMovie)
//   } catch (error) {
//     console.error('❌ Database error:', error)
//     return Response.json({ error: 'Database error' }, { status: 500 })
//   }
// }

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const movieId = parseInt(id)

    const prisma = new PrismaClient().$extends(withAccelerate())
    const movie = await prisma.content.findUnique({
      where: { id: movieId }
    })

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json(movie)

  } catch (error) {
    return NextResponse.json(
      { error: 'Database error' }, 
      { status: 500 }
    )
  }
}