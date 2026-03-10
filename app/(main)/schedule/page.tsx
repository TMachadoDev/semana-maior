'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'

interface ScheduleEvent {
  id: string
  title: string
  description?: string
  type: string
  startTime: string
  endTime?: string
  venue?: string
  day: number
  featured: boolean
}

const eventTypes: Record<string, { label: string; color: string; emoji: string }> = {
  TOURNAMENT: { label: 'Torneio', color: '#bc2a24', emoji: '🏆' },
  CONCERT:    { label: 'Show',    color: '#6366f1', emoji: '🎵' },
  GAME:       { label: 'Jogo',    color: '#059669', emoji: '⚽' },
  SHOWCASE:   { label: 'Apres.', color: '#d97706', emoji: '🎭' },
  CEREMONY:   { label: 'Cerim.', color: '#0ea5e9', emoji: '🎖️' },
  OTHER:      { label: 'Outro',   color: '#6b7280', emoji: '📌' },
}

function formatTime(iso: string) {
  try { return new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) }
  catch { return iso }
}

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState<1 | 2>(1)
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchEvents = async (day: number) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/schedule?day=${day}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setEvents(data)
    } catch {
      setError('Erro ao carregar a programação.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents(activeDay) }, [activeDay])

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Programação" subtitle="26–27 de Março" />

      <div className="px-5 pt-5">
        <div className="flex gap-2 p-1 bg-[#f7f7f7] rounded-2xl">
          {([1, 2] as const).map((day) => (
            <button key={day} onClick={() => setActiveDay(day)} className="flex-1 relative">
              {activeDay === day && (
                <motion.div layoutId="day-tab" className="absolute inset-0 bg-white rounded-xl shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <div className="relative z-10 py-2.5 text-center">
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: activeDay === day ? '#bc2a24' : '#9ca3af' }}>
                  Dia {day}
                </div>
                <div className="text-xs mt-0.5" style={{ color: activeDay === day ? '#374151' : '#9ca3af' }}>
                  {day === 1 ? '26 Mar' : '27 Mar'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeDay} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }} className="px-5 pt-6 pb-8">
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-[#f7f7f7] h-20 animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-400">{error}</p>
              <button onClick={() => fetchEvents(activeDay)} className="mt-3 text-[#bc2a24] text-sm font-medium">Tentar novamente</button>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="py-10 text-center text-gray-300 text-sm">Sem eventos para este dia.</div>
          )}

          {!loading && events.length > 0 && (
            <div className="relative">
              <div className="absolute left-[38px] top-6 bottom-6 w-px bg-gray-100" />
              <div className="space-y-4">
                {events.map((event, index) => {
                  const typeInfo = eventTypes[event.type] || eventTypes.OTHER
                  return (
                    <motion.div key={event.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex gap-4">
                      <div className="flex flex-col items-center w-[76px] flex-shrink-0">
                        <div className="text-xs font-bold text-gray-600 tabular-nums">{formatTime(event.startTime)}</div>
                        <div className="w-3 h-3 rounded-full mt-1.5 z-10 ring-2 ring-white" style={{ backgroundColor: typeInfo.color }} />
                        {event.endTime && <div className="text-[10px] text-gray-400 mt-1">{formatTime(event.endTime)}</div>}
                      </div>
                      <div className={`flex-1 rounded-2xl p-4 mb-2 border ${event.featured ? 'border-[#bc2a24]/10 bg-[#fef8f8]' : 'border-gray-100 bg-white'}`}>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2" style={{ backgroundColor: typeInfo.color + '15', color: typeInfo.color }}>
                          {typeInfo.emoji} {typeInfo.label}
                        </span>
                        <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
                        {event.description && <p className="text-xs text-gray-400 mt-0.5">{event.description}</p>}
                        {event.venue && (
                          <div className="flex items-center gap-1 mt-2">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">{event.venue}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
