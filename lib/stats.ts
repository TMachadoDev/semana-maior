import { prisma } from './prisma'
import { MatchStatus, TournamentMode } from '@prisma/client'

export async function updateTeamStats(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { tournament: true }
  })
  if (!team) return

  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { teamAId: teamId },
        { teamBId: teamId }
      ],
      status: { in: [MatchStatus.FINISHED, MatchStatus.WALKOVER] },
    }
  })

  let wins = 0
  let losses = 0
  let draws = 0
  let points = 0

  for (const match of matches) {
    const isTeamA = match.teamAId === teamId

    if (match.status === MatchStatus.WALKOVER) {
      if (match.walkoverWinnerTeamId === teamId) {
        wins++
        points += 3
      } else {
        losses++
      }
      continue
    }

    if (team.tournament?.mode === TournamentMode.VOLLEY) {
      if (match.winnerTeamId === teamId) {
        wins++
        points += 3
      } else {
        losses++
      }
    } else {
      // FUTSAL
      if (match.teamAScore === null || match.teamBScore === null) continue

      const teamScore = isTeamA ? match.teamAScore : match.teamBScore
      const opponentScore = isTeamA ? match.teamBScore : match.teamAScore

      if (teamScore > opponentScore) {
        wins++
        points += 3
      } else if (teamScore < opponentScore) {
        losses++
      } else {
        draws++
        points += 1
      }
    }
  }

  const updatedTeam = await prisma.team.update({
    where: { id: teamId },
    data: { points, wins, losses, draws },
    include: { tournament: true }
  })

  const category = updatedTeam.tournament?.sport || 'overall'

  // Upsert the entry for the specific category
  await prisma.leaderboardEntry.upsert({
    where: { teamId_category: { teamId: teamId, category: category } },
    update: { points, teamName: updatedTeam.name, course: updatedTeam.course },
    create: { teamId, teamName: updatedTeam.name, course: updatedTeam.course, points, rank: 1, category }
  })

  // Upsert the entry for 'overall'
  if (category !== 'overall') {
    await prisma.leaderboardEntry.upsert({
      where: { teamId_category: { teamId: teamId, category: 'overall' } },
      update: { points, teamName: updatedTeam.name, course: updatedTeam.course },
      create: { teamId, teamName: updatedTeam.name, course: updatedTeam.course, points, rank: 1, category: 'overall' }
    })
  }

  // RECALCULATE RANKS for the updated categories
  await recalculateCategoryRanks(category)
  if (category !== 'overall') {
    await recalculateCategoryRanks('overall')
  }

  return updatedTeam
}

async function recalculateCategoryRanks(category: string) {
  const entries = await prisma.leaderboardEntry.findMany({
    where: { category },
    orderBy: [
      { points: 'desc' },
      { updatedAt: 'asc' } // tiebreaker
    ]
  })

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    const newRank = i + 1
    
    if (entry.rank !== newRank) {
      await prisma.leaderboardEntry.update({
        where: { id: entry.id },
        data: { 
          change: entry.rank - newRank, // Positive if moved up (e.g., 5th to 3rd = +2)
          rank: newRank 
        }
      })
    }
  }
}
