import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendNotificationToAll } from '@/lib/webpush'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'tournaments') {
      const tournaments = await prisma.tournament.findMany({
        orderBy: { name: 'asc' },
      })
      return NextResponse.json(tournaments)
    }

    const tournamentId = searchParams.get('tournamentId')
    const status = searchParams.get('status')

    const matches = await prisma.match.findMany({
      where: {
        ...(tournamentId ? { tournamentId } : {}),
        ...(status ? { status: status as any } : {}),
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        tournament: true,
      },
      orderBy: { scheduledAt: 'asc' },
    })

    return NextResponse.json(matches)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const match = await prisma.match.create({
      data: {
        tournamentId: body.tournamentId,
        homeTeamId: body.homeTeamId,
        awayTeamId: body.awayTeamId,
        scheduledAt: new Date(body.scheduledAt),
        stage: body.stage || 'group',
        venue: body.venue,
        homeScore: body.homeScore,
        awayScore: body.awayScore,
        status: body.status || 'SCHEDULED',
      },
      include: { homeTeam: true, awayTeam: true },
    })
    return NextResponse.json(match, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 })
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
    const match = await prisma.match.update({
      where: { id },
      data: {
        tournamentId: data.tournamentId,
        homeTeamId: data.homeTeamId,
        awayTeamId: data.awayTeamId,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        stage: data.stage,
        venue: data.venue,
        homeScore: data.homeScore,
        awayScore: data.awayScore,
        status: data.status,
      },
      include: { homeTeam: true, awayTeam: true },
    })

    // Se o status mudou para FINISHED, mandar notificação
    if (data.status === 'FINISHED' && data.homeScore !== undefined && data.awayScore !== undefined) {
      await sendNotificationToAll({
        title: 'Fim de Jogo! 🏆',
        body: `${match.homeTeam.name} ${data.homeScore} x ${data.awayScore} ${match.awayTeam.name}`,
        url: '/matches',
      })
    }

    return NextResponse.json(match)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update match' }, { status: 500 })
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

    await prisma.match.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete match' }, { status: 500 })
  }
}
