'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Trophy, ChevronDown, Activity, Clock, CheckCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { useQuery } from '@tanstack/react-query'
import { getPhaseLabel } from '@/utils/tournament'

interface Tournament {
  id: string
  name: string
  sport: string
  mode: 'FUTSAL' | 'VOLLEY'
  status: string
}

interface Team {
  id: string
  name: string
  course: string
  color: string
  points: number
  wins: number
  losses: number
  draws: number
  school?: { name: string }
  tournamentId?: string
  group?: { 
    name: string
    tournamentId: string
  }
}

interface Match {
  id: string
  tournamentId: string
  teamA: Team
  teamB: Team
  teamAId: string
  teamBId: string
  teamAScore: number | null
  teamBScore: number | null
  winnerTeamId: string | null
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'CANCELLED' | 'WALKOVER'
  scheduledAt: string | null
  phase: string
  leg: number | null
}

function formatTime(iso?: string | null) {
  if (!iso) return 'Por definir'
  try { return new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) }
  catch { return '' }
}

async function fetchTournaments(): Promise<Tournament[]> {
  const res = await fetch('/api/matches?type=tournaments')
  if (!res.ok) throw new Error('Failed to fetch tournaments')
  return res.json()
}

async function fetchTournamentData(tournamentId: string): Promise<{ teams: Team[], matches: Match[] }> {
  const [teamsRes, matchesRes] = await Promise.all([
    fetch('/api/teams'),
    fetch(`/api/matches?tournamentId=${tournamentId}`),
  ])
  
  if (!teamsRes.ok || !matchesRes.ok) throw new Error('Failed to fetch tournament data')
  
  const teamsData: Team[] = await teamsRes.json()
  const matchesData: Match[] = await matchesRes.json()
  
  const filteredTeams = teamsData.filter(t => t.tournamentId === tournamentId || t.group?.tournamentId === tournamentId)
  
  return { teams: filteredTeams, matches: matchesData }
}

export default function TournamentPage() {
  const [activeTab, setActiveTab] = useState<'groups' | 'matches' | 'bracket'>('groups')
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [cooldown, setCooldown] = useState(0)

  const { data: tournaments = [], isLoading: isLoadingTournaments } = useQuery({
    queryKey: ['tournaments'],
    queryFn: fetchTournaments,
  })

  useEffect(() => {
    if (tournaments.length > 0 && !selectedTournament) {
      setSelectedTournament(tournaments[0])
    }
  }, [tournaments, selectedTournament])

  const { data, isLoading: isLoadingData, refetch, isFetching } = useQuery({
    queryKey: ['tournament-data', selectedTournament?.id],
    queryFn: () => fetchTournamentData(selectedTournament!.id),
    enabled: !!selectedTournament,
    refetchInterval: 30000
  })

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  // Automatically adjust default tab for Volley
  useEffect(() => {
    if (selectedTournament?.mode === 'VOLLEY' && activeTab === 'groups') {
      setActiveTab('bracket')
    }
  }, [selectedTournament?.mode, activeTab])

  const handleRefresh = () => {
    if (cooldown === 0) {
      refetch()
      setCooldown(90)
    }
  }

  const teams = data?.teams || []
  const matches = data?.matches || []
  const loading = isLoadingTournaments || isLoadingData

  const isFutsal = selectedTournament?.mode !== 'VOLLEY' // default to futsal logic if unknown

  const grouped = teams.reduce<Record<string, Team[]>>((acc, t) => {
    const g = t.group?.name || 'Sem Grupo'
    if (!acc[g]) acc[g] = []
    acc[g].push(t)
    return acc
  }, {})

  Object.keys(grouped).forEach(g => {
    grouped[g].sort((a, b) => b.points - a.points)
  })

  // Futsal phases logic
  const groupMatches = matches.filter(m => m.phase === 'INITIAL_STAGE' || !m.phase)
  const knockoutMatches = matches.filter(m => m.phase !== 'INITIAL_STAGE' && m.phase !== 'FINAL')
  const finalMatch = matches.find(m => m.phase === 'FINAL')

  return (
    <div className="min-h-screen bg-white pb-32">
      <PageHeader 
        title="Torneios" 
        subtitle={selectedTournament ? `${selectedTournament.sport} · Modalidade` : "Escolha uma modalidade"} 
        showBack 
      />

      <div className="px-6 mb-8 mt-4">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modalidade</span>
            </div>
            <button 
              onClick={handleRefresh} 
              disabled={isLoadingData || isFetching || cooldown > 0}
              className="px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all bg-[#f7f7f7] text-gray-600 active:scale-95 disabled:opacity-70 disabled:active:scale-100 min-w-[80px] justify-center"
            >
              {cooldown > 0 ? (
                <span className="text-[9px] font-black tabular-nums text-[#bc2a24]">
                  {Math.floor(cooldown / 60)}:{(cooldown % 60).toString().padStart(2, '0')}
                </span>
              ) : (
                <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {cooldown > 0 ? 'Espera' : isFetching ? '...' : 'Atualizar'}
              </span>
            </button>
        </div>
        <div className="relative">
          <select
            value={selectedTournament?.id || ''}
            onChange={(e) => {
              const id = e.target.value
              const tournament = tournaments.find(t => t.id === id)
              if (tournament) setSelectedTournament(tournament)
            }}
            className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#bc2a24]/10 transition-all"
          >
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="px-6">
        <div className="flex p-1 bg-gray-100 rounded-2xl">
          {isFutsal && (
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                activeTab === 'groups' ? 'bg-white text-[#bc2a24] shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Grupos
            </button>
          )}
          <button
            onClick={() => setActiveTab('matches')}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
              activeTab === 'matches' ? 'bg-white text-[#bc2a24] shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Jogos
          </button>
          <button
            onClick={() => setActiveTab('bracket')}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
              activeTab === 'bracket' ? 'bg-white text-[#bc2a24] shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Finais
          </button>
        </div>
      </div>

      <div className="px-6 pt-8">
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="rounded-3xl bg-[#f7f7f7] h-24 animate-pulse" />)}
          </div>
        )}

        {/* GROUPS - Futsal Only */}
        {!loading && activeTab === 'groups' && isFutsal && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            {Object.keys(grouped).length === 0 && (
              <div className="py-20 text-center flex flex-col items-center">
                <Trophy className="w-12 h-12 text-gray-100 mb-4" />
                <p className="text-sm text-gray-400 font-medium">Nenhum grupo definido.</p>
              </div>
            )}
            {Object.entries(grouped).map(([groupName, groupTeams]) => (
              <div key={groupName}>
                <div className="flex items-center gap-3 mb-4 ml-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#bc2a24]" />
                    <h3 className="text-[11px] text-gray-900 uppercase tracking-[0.2em] font-black">{groupName}</h3>
                </div>
                <div className="rounded-[2.5rem] border border-gray-100 bg-white shadow-xl shadow-black/[0.02] overflow-hidden">
                  <div className="flex items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                    <div className="flex-1 text-[9px] text-gray-400 font-black uppercase tracking-widest">Equipa</div>
                    <div className="w-10 text-center text-[9px] text-gray-400 font-black">J</div>
                    <div className="w-10 text-center text-[9px] text-gray-400 font-black">V</div>
                    <div className="w-12 text-center text-[9px] text-[#bc2a24] font-black">PTS</div>
                  </div>
                  {groupTeams.map((team, i) => (
                    <div key={team.id} className={`flex items-center px-6 py-5 ${i < groupTeams.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <span className={`text-xs font-black w-4 ${i < 4 ? 'text-[#bc2a24]' : 'text-gray-300'}`}>{i + 1}</span>
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-[11px] font-black flex-shrink-0 shadow-md shadow-black/5" style={{ backgroundColor: team.color || '#6b7280' }}>
                          {team.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{team.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium truncate uppercase tracking-tighter">{team.course}</p>
                        </div>
                      </div>
                      <div className="w-10 text-center text-xs font-bold text-gray-500 tabular-nums">{team.wins + team.losses + team.draws}</div>
                      <div className="w-10 text-center text-xs font-bold text-gray-500 tabular-nums">{team.wins}</div>
                      <div className="w-12 text-center text-lg font-black text-[#bc2a24] tabular-nums">{team.points}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* MATCHES */}
        {!loading && activeTab === 'matches' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 pb-10">
            {matches.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center">
                 <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 flex items-center justify-center mb-6">
                    <Activity className="w-10 h-10 text-gray-200" />
                 </div>
                 <h3 className="text-gray-900 font-bold mb-1">Sem jogos agendados</h3>
                 <p className="text-sm text-gray-400 max-w-[200px] mx-auto">Ainda não foram definidos jogos para esta modalidade.</p>
              </div>
            )}
            {matches.map((match) => (
              <div key={match.id} className={`rounded-[2.5rem] p-6 border shadow-sm transition-all ${match.status === 'LIVE' ? 'border-[#bc2a24]/20 bg-red-50/30' : 'border-gray-100 bg-white'}`}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-300" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{formatTime(match.scheduledAt)} · {getPhaseLabel(match.phase)} {match.leg ? `(Mão ${match.leg})` : ''}</span>
                  </div>
                  {match.status === 'LIVE' && <span className="flex items-center gap-1.5 text-[9px] font-black text-[#bc2a24] uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded-full border border-red-100">AO VIVO</span>}
                  {match.status === 'FINISHED' && <span className="text-[9px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full uppercase">Terminado</span>}
                  {match.status === 'WALKOVER' && <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase border border-amber-100">W.O.</span>}
                </div>
                
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-lg font-black text-gray-400" style={match.winnerTeamId === match.teamAId ? { backgroundColor: match.teamA?.color, color: '#fff', borderColor: 'transparent' } : {}}>
                      {match.teamA?.name.charAt(0)}
                    </div>
                    <p className="font-black text-[10px] text-gray-900 uppercase text-center truncate w-full">{match.teamA?.name}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 px-5 py-2.5 bg-gray-50 rounded-[1.5rem] border border-gray-100 shadow-inner">
                    {!isFutsal ? (
                        <span className="text-xs font-black text-gray-400 tracking-widest uppercase">VS</span>
                    ) : (
                      <>
                        <span className={`text-2xl font-black tabular-nums ${match.status === 'LIVE' ? 'text-[#bc2a24]' : 'text-gray-900'}`}>{match.teamAScore ?? '0'}</span>
                        <span className="text-[10px] font-black text-gray-300">VS</span>
                        <span className={`text-2xl font-black tabular-nums ${match.status === 'LIVE' ? 'text-[#bc2a24]' : 'text-gray-900'}`}>{match.teamBScore ?? '0'}</span>
                      </>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-lg font-black text-gray-400" style={match.winnerTeamId === match.teamBId ? { backgroundColor: match.teamB?.color, color: '#fff', borderColor: 'transparent' } : {}}>
                      {match.teamB?.name.charAt(0)}
                    </div>
                    <p className="font-black text-[10px] text-gray-900 uppercase text-center truncate w-full">{match.teamB?.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* BRACKET */}
        {!loading && activeTab === 'bracket' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pb-10">
            <div className="rounded-[3rem] border border-gray-100 p-8 bg-white shadow-xl shadow-black/[0.02]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-[#bc2a24]" />
                <h3 className="text-[11px] text-gray-900 uppercase tracking-[0.2em] font-black">Fase de Eliminatórias</h3>
              </div>

              {knockoutMatches.length === 0 && !finalMatch ? (
                <p className="text-sm text-gray-300 text-center py-12 font-medium">Fase final ainda não iniciada</p>
              ) : (
                <div className="space-y-5">
                  {knockoutMatches.map(match => (
                    <div key={match.id} className="rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                      <div className={`px-6 py-4 flex items-center justify-between border-b border-gray-50 ${match.winnerTeamId === match.teamAId ? 'bg-green-50/30' : ''}`}>
                        <span className="font-bold text-sm text-gray-900">{match.teamA?.name}</span>
                        {isFutsal && <span className="font-black text-lg text-[#bc2a24] tabular-nums">{match.teamAScore ?? '—'}</span>}
                        {!isFutsal && match.winnerTeamId === match.teamAId && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <div className={`px-6 py-4 flex items-center justify-between bg-white ${match.winnerTeamId === match.teamBId ? 'bg-green-50/30' : ''}`}>
                        <span className="font-bold text-sm text-gray-900">{match.teamB?.name}</span>
                        {isFutsal && <span className="font-black text-lg text-[#bc2a24] tabular-nums">{match.teamBScore ?? '—'}</span>}
                        {!isFutsal && match.winnerTeamId === match.teamBId && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <div className="px-6 py-2.5 bg-gray-50 flex items-center justify-between">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{getPhaseLabel(match.phase)} {match.leg ? `(Mão ${match.leg})` : ''}</span>
                        {match.status === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-[#bc2a24] animate-pulse" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="my-10 flex items-center gap-5">
                <div className="flex-1 h-px bg-gray-100" />
                <div className="px-4 py-1.5 rounded-full border border-gray-100 bg-gray-50">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">Grande Final</span>
                </div>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="rounded-[2.5rem] border-2 border-[#bc2a24]/10 bg-[#fef8f8] overflow-hidden shadow-2xl shadow-[#bc2a24]/10">
                {finalMatch ? (
                  <>
                    <div className={`px-6 py-5 flex items-center justify-between border-b border-[#bc2a24]/5 bg-white/50 ${finalMatch.winnerTeamId === finalMatch.teamAId ? 'bg-green-50/30' : ''}`}>
                      <span className="font-black text-sm text-gray-900 uppercase tracking-tight">{finalMatch.teamA?.name}</span>
                      {isFutsal && <span className="font-black text-2xl text-gray-900 tabular-nums">{finalMatch.teamAScore ?? '—'}</span>}
                      {!isFutsal && finalMatch.winnerTeamId === finalMatch.teamAId && <Trophy className="w-5 h-5 text-yellow-500" />}
                    </div>
                    <div className={`px-6 py-5 flex items-center justify-between bg-white/50 ${finalMatch.winnerTeamId === finalMatch.teamBId ? 'bg-green-50/30' : ''}`}>
                      <span className="font-black text-sm text-gray-900 uppercase tracking-tight">{finalMatch.teamB?.name}</span>
                      {isFutsal && <span className="font-black text-2xl text-gray-900 tabular-nums">{finalMatch.teamBScore ?? '—'}</span>}
                      {!isFutsal && finalMatch.winnerTeamId === finalMatch.teamBId && <Trophy className="w-5 h-5 text-yellow-500" />}
                    </div>
                  </>
                ) : (
                  <div className="px-6 py-12 flex flex-col items-center opacity-30">
                    <Trophy className="w-10 h-10 text-gray-400 mb-3" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aguardando Finalistas</span>
                  </div>
                )}
                <div className="px-6 py-4 bg-[#bc2a24] flex items-center justify-center gap-3">
                  <Trophy className="w-5 h-5 text-white shadow-sm" />
                  <span className="text-[11px] text-white font-black uppercase tracking-[0.2em]">Troféu de Campeão</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
