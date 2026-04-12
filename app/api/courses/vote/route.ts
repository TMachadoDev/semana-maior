import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const votes = await prisma.courseVote.groupBy({
      by: ['courseId'],
      _count: {
        id: true,
      },
    })
    return NextResponse.json(votes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'

  try {
    const body = await request.json()
    const { courseId } = body

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID required' }, { status: 400 })
    }

    // Check if user already voted (if logged in)
    if (userId) {
      const existingVote = await prisma.courseVote.findUnique({
        where: { userId },
      })
      if (existingVote) {
        return NextResponse.json({ error: 'Você já votou!' }, { status: 400 })
      }
    } else {
        // If not logged in, check by IP (simple check)
        const existingVote = await prisma.courseVote.findFirst({
            where: { ip },
        })
        if (existingVote) {
            return NextResponse.json({ error: 'Você já votou!' }, { status: 400 })
        }
    }

    const vote = await prisma.courseVote.create({
      data: {
        courseId,
        userId: userId || null,
        ip: userId ? null : ip,
      },
    })

    return NextResponse.json(vote, { status: 201 })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 })
  }
}
