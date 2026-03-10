'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'

interface Team {
  id: string
  name: string
  course: string
  color: string
  points: number
  wins: number
  losses: number
  draws: number
  group?: { name: string }
}

interface Match {
  id: string
  homeTeam: Team
  awayTeam: Team
  homeScore: number | null
  awayScore: number | null
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'CANCELLED'
  scheduledAt: string
  stage: string
}

function formatTime(iso: string) {
  try { return new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) }
  catch { return '' }
}

export default function TournamentPage() {
  const [activeTab, setActiveTab] = useState<'groups' | 'matches' | 'bracket'>('groups')
  const [teams, setTeams] = useState<Team[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [teamsRes, matchesRes] = await Promise.all([
          fetch('/api/teams'),
          fetch('/api/matches'),
        ])
        const teamsData: Team[] = teamsRes.ok ? await teamsRes.json() : []
        const matchesData: Match[] = matchesRes.ok ? await matchesRes.json() : []
        setTeams(teamsData)
        setMatches(matchesData)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  // Group teams by group name
  const grouped = teams.reduce<Record<string, Team[]>>((acc, t) => {
    const g = t.group?.name || 'Sem Grupo'
    if (!acc[g]) acc[g] = []
    acc[g].push(t)
    return acc
  }, {})

  // Sort each group by points desc
  Object.keys(grouped).forEach(g => {
    grouped[g].sort((a, b) => b.points - a.points)
  })

  const groupMatches = matches.filter(m => m.stage === 'group' || !m.stage)
  const knockoutMatches = matches.filter(m => m.stage === 'knockout' || m.stage === 'semifinal')
  const finalMatch = matches.find(m => m.stage === 'final')

  const liveMatch = matches.find(m => m.status === 'LIVE')

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Torneio" subtitle="Futsal · Semana Maior" />

      {liveMatch && (
        <div className="px-5 mb-3">
          <div className="rounded-2xl bg-[#fef2f2] border border-[#bc2a24]/15 p-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#bc2a24] live-indicator flex-shrink-0" />
            <span className="text-xs font-semibold text-[#bc2a24]">AO VIVO:</span>
            <span className="text-xs text-gray-700 font-medium truncate">
              {liveMatch.homeTeam.name} {liveMatch.homeScore ?? '—'} × {liveMatch.awayScore ?? '—'} {liveMatch.awayTeam.name}
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-5">
        <div className="flex gap-1 p-1 bg-[#f7f7f7] rounded-2xl">
          {(['groups', 'matches', 'bracket'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="flex-1 relative">
              {activeTab === tab && (
                <motion.div layoutId="tournament-tab" className="absolute inset-0 bg-white rounded-xl shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <div className="relative z-10 py-2 text-center">
                <span className="text-xs font-semibold" style={{ color: activeTab === tab ? '#bc2a24' : '#9ca3af' }}>
                  {tab === 'groups' ? 'Grupos' : tab === 'matches' ? 'Jogos' : 'Chaveamento'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 pb-8">
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="rounded-2xl bg-[#f7f7f7] h-16 animate-pulse" />)}
          </div>
        )}

        {/* GROUPS */}
        {!loading && activeTab === 'groups' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {Object.keys(grouped).length === 0 && (
              <p className="text-sm text-gray-300 text-center py-8">Sem equipas ainda.</p>
            )}
            {Object.entries(grouped).map(([groupName, groupTeams]) => (
              <div key={groupName}>
                <h3 className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">{groupName}</h3>
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center px-4 py-2 bg-[#f7f7f7]">
                    <div className="flex-1 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Equipa</div>
                    <div className="w-8 text-center text-[10px] text-gray-400 font-semibold">J</div>
                    <div className="w-8 text-center text-[10px] text-gray-400 font-semibold">V</div>
                    <div className="w-8 text-center text-[10px] text-gray-400 font-semibold">D</div>
                    <div className="w-10 text-center text-[10px] text-[#bc2a24] font-bold">PTS</div>
                  </div>
                  {groupTeams.map((team, i) => (
                    <div key={team.id} className={`flex items-center px-4 py-3 ${i < groupTeams.length - 1 ? 'border-b border-gray-50' : ''} ${i < 2 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className={`text-xs font-bold w-4 ${i < 2 ? 'text-[#bc2a24]' : 'text-gray-300'}`}>{i + 1}</span>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0" style={{ backgroundColor: team.color || '#6b7280' }}>
                          {team.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{team.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{team.course}</p>
                        </div>
                      </div>
                      <div className="w-8 text-center text-xs text-gray-500">{team.wins + team.losses + team.draws}</div>
                      <div className="w-8 text-center text-xs text-gray-500">{team.wins}</div>
                      <div className="w-8 text-center text-xs text-gray-500">{team.losses}</div>
                      <div className="w-10 text-center text-sm font-bold text-[#bc2a24]">{team.points}</div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5 ml-1">* Top 2 avançam para as semifinais</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* MATCHES */}
        {!loading && activeTab === 'matches' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {matches.length === 0 && <p className="text-sm text-gray-300 text-center py-8">Sem partidas ainda.</p>}
            {matches.map((match) => (
              <div key={match.id} className={`rounded-2xl p-4 border ${match.status === 'LIVE' ? 'border-[#bc2a24]/20 bg-[#fef8f8]' : 'border-gray-100 bg-white'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">{formatTime(match.scheduledAt)}</span>
                  {match.status === 'LIVE' && <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#bc2a24]"><span className="w-1.5 h-1.5 rounded-full bg-[#bc2a24] live-indicator" />AO VIVO</span>}
                  {match.status === 'FINISHED' && <span className="text-[10px] text-gray-400">Encerrado</span>}
                  {match.status === 'SCHEDULED' && <span className="text-[10px] text-blue-500">Em breve</span>}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm text-gray-900 flex-1">{match.homeTeam.name}</p>
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-xl font-black text-gray-900 tabular-nums">{match.homeScore ?? '—'}</span>
                    <span className="text-xs text-gray-300">×</span>
                    <span className="text-xl font-black text-gray-900 tabular-nums">{match.awayScore ?? '—'}</span>
                  </div>
                  <p className="font-semibold text-sm text-gray-900 flex-1 text-right">{match.awayTeam.name}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* BRACKET */}
        {!loading && activeTab === 'bracket' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-2xl border border-gray-100 p-5 bg-white">
              <h3 className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-4">Semifinais</h3>
              {knockoutMatches.length === 0 ? (
                <p className="text-sm text-gray-300 text-center py-4">Semifinais ainda não definidas</p>
              ) : (
                <div className="space-y-3">
                  {knockoutMatches.map(match => (
                    <div key={match.id} className="rounded-xl border border-gray-100 overflow-hidden">
                      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50">
                        <span className="font-medium text-sm text-gray-900">{match.homeTeam.name}</span>
                        <span className="font-bold text-gray-500">{match.homeScore ?? '—'}</span>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between">
                        <span className="font-medium text-sm text-gray-900">{match.awayTeam.name}</span>
                        <span className="font-bold text-gray-500">{match.awayScore ?? '—'}</span>
                      </div>
                      <div className="px-4 py-1.5 bg-[#f7f7f7]">
                        <span className="text-[10px] text-gray-400">{formatTime(match.scheduledAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="my-4 flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 uppercase tracking-widest">Final</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="rounded-xl border-2 border-[#bc2a24]/20 bg-[#fef8f8] overflow-hidden">
                {finalMatch ? (
                  <>
                    <div className="px-4 py-3 flex items-center justify-between border-b border-[#bc2a24]/10">
                      <span className="font-medium text-sm text-gray-900">{finalMatch.homeTeam.name}</span>
                      <span className="font-bold text-gray-500">{finalMatch.homeScore ?? '—'}</span>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span className="font-medium text-sm text-gray-900">{finalMatch.awayTeam.name}</span>
                      <span className="font-bold text-gray-500">{finalMatch.awayScore ?? '—'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 flex items-center justify-between border-b border-[#bc2a24]/10">
                      <span className="font-medium text-sm text-gray-400">Vencedor Semi 1</span>
                      <span className="text-xs text-gray-300">—</span>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span className="font-medium text-sm text-gray-400">Vencedor Semi 2</span>
                      <span className="text-xs text-gray-300">—</span>
                    </div>
                  </>
                )}
                <div className="px-4 py-1.5 bg-[#bc2a24]/5">
                  <span className="text-[10px] text-[#bc2a24] font-semibold">🏆 Grande Final</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
