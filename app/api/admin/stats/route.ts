import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [events, teams, players, talents, matches, gallery] = await Promise.all([
      prisma.scheduleEvent.count(),
      prisma.team.count(),
      prisma.player.count(),
      prisma.talent.count(),
      prisma.match.count(),
      prisma.galleryImage.count(),
    ])

    return NextResponse.json({
      events,
      teams,
      players,
      talents,
      matches,
      gallery,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
