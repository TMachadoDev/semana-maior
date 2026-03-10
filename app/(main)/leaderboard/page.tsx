'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'

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

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/leaderboard')
      if (!res.ok) throw new Error('Erro ao carregar')
      const data = await res.json()
      setEntries(data)
    } catch {
      setError('Não foi possível carregar o ranking.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const top3 = entries.slice(0, 3)
  const maxPoints = entries[0]?.points || 1

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Ranking" subtitle="Classificação por Equipas" />

      <div className="px-5 mb-5 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#bc2a24]/10">
          <span className="w-2 h-2 rounded-full bg-[#bc2a24] live-indicator" />
          <span className="text-xs font-semibold text-[#bc2a24]">Atualizado em tempo real</span>
        </div>
        <button onClick={fetchData} className="w-8 h-8 rounded-full bg-[#f7f7f7] flex items-center justify-center">
          <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>

      {loading && (
        <div className="px-5 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#f7f7f7] h-20 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-gray-400">{error}</p>
          <button onClick={fetchData} className="mt-3 text-[#bc2a24] text-sm font-medium">Tentar novamente</button>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="px-5 py-10 text-center text-gray-300">
          <p className="text-sm">Ranking ainda sem dados</p>
        </div>
      )}

      {!loading && entries.length > 0 && (
        <>
          {/* Podium */}
          {top3.length >= 3 && (
            <div className="px-5 mb-6">
              <div className="flex items-end justify-center gap-3 h-[140px]">
                {[top3[1], top3[0], top3[2]].map((entry, i) => {
                  const isCenter = i === 1
                  const podiumH = isCenter ? 90 : i === 0 ? 60 : 45
                  const avatarSize = isCenter ? 'w-14 h-14 text-xl' : 'w-12 h-12 text-lg'
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
                      <div className={`${avatarSize} rounded-2xl flex items-center justify-center text-white font-black shadow-lg mb-1.5`} style={{ backgroundColor: color }}>
                        {entry.teamName.charAt(0)}
                      </div>
                      <p className="text-[10px] font-semibold text-gray-600 text-center truncate w-full">{entry.teamName.split(' ')[0]}</p>
                      <p className="text-xs font-bold mt-0.5" style={{ color: podiumColor }}>{entry.points}pts</p>
                      <div className="w-full mt-2 rounded-t-xl flex items-center justify-center" style={{ height: podiumH, backgroundColor: podiumColor + '18', borderTop: `2px solid ${podiumColor}30`, borderLeft: `2px solid ${podiumColor}20`, borderRight: `2px solid ${podiumColor}20` }}>
                        <span className="text-2xl">{medal}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Full list */}
          <div className="px-5 pb-8">
            <h3 className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">
              Classificação Completa
            </h3>
            <div className="space-y-2">
              {entries.map((entry, i) => {
                const color = getColor(entry.teamName)
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`rounded-2xl p-4 border ${i === 0 ? 'border-[#bc2a24]/15 bg-[#fef8f8]' : 'border-gray-100 bg-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 text-center">
                        {i < 3 ? <span className="text-lg">{medals[i]}</span> : <span className="text-sm font-bold text-gray-400">{entry.rank}</span>}
                      </div>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: color }}>
                        {entry.teamName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">{entry.teamName}</p>
                        <p className="text-xs text-gray-400 truncate">{entry.course}</p>
                      </div>
                      <ChangeIndicator change={entry.change} />
                      <div className="text-right">
                        <div className="text-lg font-black text-gray-900 tabular-nums">{entry.points}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">pts</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
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
