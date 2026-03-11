import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const talents = await prisma.talent.findMany({
      orderBy: [{ featured: 'desc' }, { performAt: 'asc' }],
    })
    return NextResponse.json(talents)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch talents' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const talent = await prisma.talent.create({
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        performAt: body.performAt ? new Date(body.performAt) : null,
        venue: body.venue,
        featured: body.featured || false,
      },
    })
    return NextResponse.json(talent, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create talent' }, { status: 500 })
  }
}
