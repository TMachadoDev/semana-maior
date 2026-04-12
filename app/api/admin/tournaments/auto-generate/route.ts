import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateFutsalInitialStage } from '@/lib/tournament-engine'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { tournamentId } = await request.json()
    if (!tournamentId) return NextResponse.json({ error: 'Tournament ID is required' }, { status: 400 })

    const count = await generateFutsalInitialStage(tournamentId)
    
    return NextResponse.json({ success: true, count })
  } catch (error: any) {
    console.error('Auto-generate matches error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate matches' }, { status: 500 })
  }
}
