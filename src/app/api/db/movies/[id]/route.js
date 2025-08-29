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