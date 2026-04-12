'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, RefreshCw, Trophy, ChevronDown } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

interface LeaderboardEntry {
  id: string
  rank: number
  teamName: string
  course: string
  points: number
  change: number
}

const medals = ['🥇', '🥈', '🥉']

const TEAM_COLORS: Record<string, string> = {
  'Informática FC': '#bc2a24',
  'Administração United': '#1a1a2e',
  'Mecânica Bravos': '#374151',
  'Eletro Warriors': '#d97706',
  'Contabilidade Stars': '#6366f1',
  'Logística Eagles': '#059669',
}

function getColor(name: string) {
  for (const [key, val] of Object.entries(TEAM_COLORS)) {
    if (name.toLowerCase().includes(key.split(' ')[0].toLowerCase())) return val
  }
  return '#6b7280'
}

function ChangeIndicator({ change }: { change: number }) {
  if (change > 0) return (
    <div className="flex items-center gap-0.5 text-emerald-500">
      <TrendingUp className="w-3 h-3" />
      <span className="text-[10px] font-bold">+{change}</span>
    </div>
  )
  if (change < 0) return (
    <div className="flex items-center gap-0.5 text-red-400">
      <TrendingDown className="w-3 h-3" />
      <span className="text-[10px] font-bold">{change}</span>
    </div>
  )
  return <Minus className="w-3 h-3 text-gray-300" />
}

async function fetchLeaderboard(category: string): Promise<LeaderboardEntry[]> {
  const url = new URL('/api/leaderboard', window.location.origin)
  url.searchParams.append('category', category)
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Erro ao carregar ranking')
  return res.json()
}

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState('Futsal')
  const [cooldown, setCooldown] = useState(0)

  const { data: entries = [], isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['leaderboard', activeCategory],
    queryFn: () => fetchLeaderboard(activeCategory),
  })

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleRefresh = () => {
    if (cooldown === 0) {
      refetch()
      setCooldown(90)
    }
  }

  const top3 = entries.slice(0, 3)
  const maxPoints = entries[0]?.points || 1

  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHeader title="Ranking" subtitle={`Torneio de ${activeCategory}`} showBack />

      {/* Category Selector - Styled Select for reliability */}
      <div className="px-6 mt-4">
        <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modalidade</span>
        </div>
        <div className="relative">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#bc2a24]/10 transition-all"
          >
            {['Futsal', 'Voleibol'].map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'Futsal' ? '⚽' : '🏐'} {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="px-6 mb-8 mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-400">
          <Trophy className="w-4 h-4 text-[#bc2a24]" />
          <span className="text-xs font-medium">Pontuação das Equipas</span>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={isLoading || isFetching || cooldown > 0}
          className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all bg-[#f7f7f7] text-gray-600 active:scale-95 disabled:opacity-70 disabled:active:scale-100 min-w-[100px] justify-center"
        >
          {cooldown > 0 ? (
            <span className="text-[10px] font-black tabular-nums text-[#bc2a24]">
              {Math.floor(cooldown / 60)}:{(cooldown % 60).toString().padStart(2, '0')}
            </span>
          ) : (
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          )}
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {cooldown > 0 ? 'Espera' : isFetching ? '...' : 'Atualizar'}
          </span>
        </button>
      </div>

      {isLoading && entries.length === 0 && (
        <div className="px-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl bg-[#f7f7f7] h-24 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-gray-400">Não foi possível carregar o ranking.</p>
          <button onClick={() => refetch()} className="mt-4 text-[#bc2a24] text-sm font-bold uppercase tracking-widest">Tentar novamente</button>
        </div>
      )}

      {!isLoading && !error && entries.length === 0 && (
        <div className="px-6 py-12 text-center text-gray-300">
          <p className="text-sm">Ranking ainda sem dados</p>
        </div>
      )}

      {entries.length > 0 && (
        <>
          {/* Podium */}
          {top3.length >= 3 && (
            <div className="px-6 mb-12 mt-4">
              <div className="flex items-end justify-center gap-4 h-[160px]">
                {[top3[1], top3[0], top3[2]].map((entry, i) => {
                  if (!entry) return null
                  const isCenter = i === 1
                  const podiumH = isCenter ? 100 : i === 0 ? 70 : 50
                  const avatarSize = isCenter ? 'w-16 h-16 text-2xl' : 'w-14 h-14 text-xl'
                  const podiumColor = isCenter ? '#bc2a24' : i === 0 ? '#6366f1' : '#374151'
                  const medal = isCenter ? '🥇' : i === 0 ? '🥈' : '🥉'
                  const color = getColor(entry.teamName)
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex flex-col items-center flex-1"
                    >
                      <div className={`${avatarSize} rounded-2xl flex items-center justify-center text-white font-black shadow-xl mb-2`} style={{ backgroundColor: color }}>
                        {entry.teamName.charAt(0)}
                      </div>
                      <p className="text-[11px] font-bold text-gray-800 text-center truncate w-full px-1">{entry.teamName.split(' ')[0]}</p>
                      <p className="text-xs font-black mt-0.5 tabular-nums" style={{ color: podiumColor }}>{entry.points} pts</p>
                      <div className="w-full mt-3 rounded-t-2xl flex items-center justify-center relative overflow-hidden" style={{ height: podiumH, backgroundColor: podiumColor + '10', borderTop: `3px solid ${podiumColor}40` }}>
                         <div className="absolute inset-0 opacity-10 bg-gradient-to-b from-white to-transparent" />
                        <span className="text-3xl relative z-10">{medal}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Full list */}
          <div className="px-6">
            <h3 className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-5">
              Classificação Completa
            </h3>
            <div className="space-y-3">
              {entries.map((entry, i) => {
                const color = getColor(entry.teamName)
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`rounded-3xl p-5 border shadow-sm ${i === 0 ? 'border-[#bc2a24]/20 bg-[#fef8f8]' : 'border-gray-50 bg-white'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 text-center">
                        {i < 3 ? <span className="text-xl">{medals[i]}</span> : <span className="text-sm font-black text-gray-300">{entry.rank}</span>}
                      </div>
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-base flex-shrink-0 shadow-sm" style={{ backgroundColor: color }}>
                        {entry.teamName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 truncate">{entry.teamName}</p>
                        <p className="text-[10px] text-gray-400 font-medium truncate uppercase tracking-wider">{entry.course}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-gray-900 tabular-nums">{entry.points}</span>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">pts</span>
                        </div>
                        <ChangeIndicator change={entry.change} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(entry.points / maxPoints) * 100}%` }}
                          transition={{ delay: 0.3 + i * 0.05, duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
