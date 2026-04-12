import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const schoolId = searchParams.get('schoolId')
    const tournamentId = searchParams.get('tournamentId')

    if (type === 'groups') {
      const groups = await prisma.group.findMany({
        orderBy: { name: 'asc' },
      })
      return NextResponse.json(groups)
    }
    
    if (type === 'tournaments') {
      const tournaments = await prisma.tournament.findMany({
        orderBy: { name: 'asc' },
      })
      return NextResponse.json(tournaments)
    }

    const where: any = {}
    if (schoolId) where.schoolId = schoolId
    if (tournamentId) where.tournamentId = tournamentId

    const teams = await prisma.team.findMany({
      where,
      include: {
        players: true,
        school: true,
        group: { include: { tournament: true } },
        tournament: true,
      },
      orderBy: { points: 'desc' },
    })
    return NextResponse.json(teams)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const groupId = body.groupId || null
    const schoolId = body.schoolId || null
    const tournamentId = body.tournamentId || null

    const team = await prisma.$transaction(async (tx) => {
      const newTeam = await tx.team.create({
        data: {
          name: body.name,
          course: body.course,
          color: body.color || '#bc2a24',
          groupId,
          schoolId,
          tournamentId,
          points: 0,
        },
      })

      const count = await tx.team.count()

      await tx.leaderboardEntry.create({
        data: {
          teamId: newTeam.id,
          teamName: newTeam.name,
          course: newTeam.course,
          points: 0,
          rank: count,
          change: 0,
        },
      })

      return newTeam
    })

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    console.error('POST Team error:', error)
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
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

    const groupId = data.groupId || null
    const schoolId = data.schoolId || null
    const tournamentId = data.tournamentId || null

    const team = await prisma.$transaction(async (tx) => {
      const updatedTeam = await tx.team.update({
        where: { id },
        data: {
          name: data.name,
          course: data.course,
          color: data.color,
          groupId,
          schoolId,
          tournamentId,
          points: data.points,
          wins: data.wins,
          losses: data.losses,
          draws: data.draws,
        },
      })

      await tx.leaderboardEntry.upsert({
        where: { 
          teamId_category: {
            teamId: id,
            category: 'overall'
          }
        },
        update: {
          teamName: updatedTeam.name,
          course: updatedTeam.course,
          points: updatedTeam.points,
        },
        create: {
          teamId: id,
          teamName: updatedTeam.name,
          course: updatedTeam.course,
          points: updatedTeam.points,
          rank: 1,
          change: 0,
          category: 'overall'
        }
      })

      return updatedTeam
    })

    return NextResponse.json(team)
  } catch (error) {
    console.error('PUT Team error:', error)
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 })
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

    await prisma.team.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 })
  }
}
