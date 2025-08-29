import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export async function GET() {
  try {
    const prisma = new PrismaClient().$extends(withAccelerate())
    const count = await prisma.content.count()
    const firstMovie = await prisma.content.findFirst()
    
    return NextResponse.json({
      connected: true,
      totalRecords: count,
      sample: firstMovie
    })
    
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error.message
    }, { status: 500 })
  }
}