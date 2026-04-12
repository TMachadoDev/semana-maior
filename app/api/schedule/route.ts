import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const day = searchParams.get('day')
    const schoolId = searchParams.get('schoolId')

    const where: any = {}
    if (day) where.day = parseInt(day)
    if (schoolId) where.schoolId = schoolId

    const events = await prisma.scheduleEvent.findMany({
      where,
      include: { school: true },
      orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
    })

    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    // For startTime, we need to handle the time correctly.
    // Assuming the user picks a time on the specific days of the event.
    const getEventDate = (day: number) => {
      const dates: Record<number, string> = {
        1: '2026-03-23',
        2: '2026-03-24',
        3: '2026-03-25',
        4: '2026-03-26',
        5: '2026-03-27'
      }
      return dates[day] || '2026-03-23'
    }

    const eventDate = getEventDate(body.day)
    const startTime = new Date(`${eventDate}T${body.startTime}:00`)

    const event = await prisma.scheduleEvent.create({
      data: {
        title: body.title,
        description: body.description || '',
        type: body.type,
        startTime: startTime,
        venue: body.venue,
        day: body.day,
        featured: body.featured || false,
        schoolId: body.schoolId,
      },
    })
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, ...data } = body
    
    const getEventDate = (day: number) => {
      const dates: Record<number, string> = {
        1: '2026-03-23',
        2: '2026-03-24',
        3: '2026-03-25',
        4: '2026-03-26',
        5: '2026-03-27'
      }
      return dates[day] || '2026-03-23'
    }

    const eventDate = getEventDate(data.day)
    const startTime = new Date(`${eventDate}T${data.startTime}:00`)

    const event = await prisma.scheduleEvent.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        startTime: startTime,
        venue: data.venue,
        day: data.day,
        featured: data.featured,
        schoolId: data.schoolId,
      },
    })
    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await prisma.scheduleEvent.delete({
      where: { id },
    })
    return NextResponse.json({ message: 'Event deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
