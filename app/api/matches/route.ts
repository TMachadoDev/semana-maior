import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MatchStatus } from '@prisma/client'
import { updateTeamStats } from '@/lib/stats'

export const dynamic = "force-dynamic"

function calculateMatchStatus(scheduledAt?: Date | null, teamAScore?: number | null, teamBScore?: number | null, currentStatus?: MatchStatus): MatchStatus {
  // If scores are present, it's definitely finished
  if (teamAScore !== null && teamBScore !== null && teamAScore !== undefined && teamBScore !== undefined) {
    return MatchStatus.FINISHED
  }

  // If status was manually set to something else (like CANCELLED or WALKOVER), keep it
  if (currentStatus === MatchStatus.CANCELLED || currentStatus === MatchStatus.WALKOVER) {
    return currentStatus
  }

  if (!scheduledAt) return MatchStatus.SCHEDULED

  const now = new Date()
  const lisbonTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Lisbon" }))
  
  const diffInMinutes = (lisbonTime.getTime() - scheduledAt.getTime()) / (1000 * 60)

  // A match is LIVE from its start time until 90 minutes later (typical duration + padding)
  if (diffInMinutes >= 0 && diffInMinutes < 90) {
    return MatchStatus.LIVE
  } else if (diffInMinutes >= 90) {
    return MatchStatus.FINISHED
  }

  return MatchStatus.SCHEDULED
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const schoolId = searchParams.get('schoolId')

    if (type === 'tournaments') {
      const tournaments = await prisma.tournament.findMany({
        where: { sport: { not: 'Badminton' } },
        orderBy: { name: 'asc' },
      })
      return NextResponse.json(tournaments)
    }

    const tournamentId = searchParams.get('tournamentId')
    const requestedStatus = searchParams.get('status')

    const matches = await prisma.match.findMany({
      where: {
        ...(tournamentId ? { tournamentId } : {}),
        ...(schoolId ? { schoolId } : {}),
        tournament: { sport: { not: 'Badminton' } }
      },
      include: {
        teamA: { include: { school: true } },
        teamB: { include: { school: true } },
        tournament: true,
        school: true,
      },
      orderBy: { scheduledAt: 'asc' },
    })

    // Dynamically calculate status for each match before sending to frontend
    const processedMatches = matches.map(match => {
      const liveStatus = calculateMatchStatus(match.scheduledAt, match.teamAScore, match.teamBScore, match.status)
      return { ...match, status: liveStatus }
    })

    // Filter by status if requested after dynamic calculation
    const finalMatches = requestedStatus 
      ? processedMatches.filter(m => m.status === requestedStatus)
      : processedMatches

    return NextResponse.json(finalMatches)
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
    const scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null
    
    const status = calculateMatchStatus(scheduledAt, body.teamAScore, body.teamBScore, body.status)

    const match = await prisma.match.create({
      data: {
        tournamentId: body.tournamentId,
        teamAId: body.teamAId,
        teamBId: body.teamBId,
        scheduledAt,
        phase: body.phase || 'INITIAL_STAGE',
        leg: body.leg,
        location: body.location,
        teamAScore: body.teamAScore,
        teamBScore: body.teamBScore,
        winnerTeamId: body.winnerTeamId,
        walkoverWinnerTeamId: body.walkoverWinnerTeamId,
        status: status,
        schoolId: body.schoolId,
      },
      include: { teamA: true, teamB: true },
    })

    await updateTeamStats(match.teamAId)
    await updateTeamStats(match.teamBId)

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
    
    const scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : undefined
    const existingMatch = await prisma.match.findUnique({ where: { id } })
    if (!existingMatch) return NextResponse.json({ error: 'Match not found' }, { status: 404 })

    const finalScheduledAt = scheduledAt !== undefined ? scheduledAt : existingMatch.scheduledAt
    const status = calculateMatchStatus(finalScheduledAt, data.teamAScore, data.teamBScore, data.status)

    const match = await prisma.match.update({
      where: { id },
      data: {
        tournamentId: data.tournamentId,
        teamAId: data.teamAId,
        teamBId: data.teamBId,
        scheduledAt: finalScheduledAt,
        phase: data.phase,
        leg: data.leg,
        location: data.location,
        teamAScore: data.teamAScore,
        teamBScore: data.teamBScore,
        winnerTeamId: data.winnerTeamId,
        walkoverWinnerTeamId: data.walkoverWinnerTeamId,
        status: status,
        schoolId: data.schoolId,
      },
      include: { teamA: true, teamB: true },
    })

    await updateTeamStats(match.teamAId)
    await updateTeamStats(match.teamBId)

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
    if (!id) return NextResponse.json({ id: 'ID required' }, { status: 400 })

    const match = await prisma.match.findUnique({ where: { id } })
    if (match) {
      await prisma.match.delete({ where: { id } })
      await updateTeamStats(match.teamAId)
      await updateTeamStats(match.teamBId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete match' }, { status: 500 })
  }
}
