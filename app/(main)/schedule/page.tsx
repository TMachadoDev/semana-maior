'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, School as SchoolIcon, ChevronDown, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { useQuery } from '@tanstack/react-query'

interface School {
  id: string
  name: string
  slug: string
}

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
  schoolId: string
  school?: School
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

async function fetchEvents(day: number, schoolId?: string): Promise<ScheduleEvent[]> {
  const url = new URL('/api/schedule', window.location.origin)
  url.searchParams.append('day', day.toString())
  if (schoolId) url.searchParams.append('schoolId', schoolId)
  
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Erro ao carregar a programação.')
  return res.json()
}

async function fetchSchools(): Promise<School[]> {
  const res = await fetch('/api/schools')
  if (!res.ok) throw new Error('Erro ao carregar as escolas.')
  return res.json()
}

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [activeSchoolId, setActiveSchoolId] = useState<string | undefined>(undefined)

  const { data: schools = [] } = useQuery({
    queryKey: ['schools'],
    queryFn: fetchSchools,
  })

  const { data: events = [], isLoading, error, refetch } = useQuery({
    queryKey: ['schedule', activeDay, activeSchoolId],
    queryFn: () => fetchEvents(activeDay, activeSchoolId),
  })

  const dayDates: Record<number, string> = {
    1: '23 Mar',
    2: '24 Mar',
    3: '25 Mar',
    4: '26 Mar',
    5: '27 Mar'
  }

  const getDayLabel = (day: number) => {
    const dates: Record<number, number> = {
      1: 23,
      2: 24,
      3: 25,
      4: 26,
      5: 27
    }
    return dates[day] || 23
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHeader title="Programação" subtitle="23–27 de Março" showBack />

      {/* Day Selector - Segmented Control Style */}
      <div className="px-5 pt-5">
        <div className="flex p-1 bg-gray-100 rounded-[1.25rem] overflow-x-auto no-scrollbar">
          {([1, 2, 3, 4, 5] as const).map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-1 min-w-[60px] py-2.5 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                activeDay === day 
                  ? 'bg-white text-[#bc2a24] shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Dia {day}
            </button>
          ))}
        </div>
      </div>

      {/* School Selector - Styled Select for better reliability */}
      <div className="px-5 mt-4">
        <div className="relative">
          <select
            value={activeSchoolId || ''}
            onChange={(e) => setActiveSchoolId(e.target.value || undefined)}
            className="w-full h-12 pl-11 pr-10 bg-gray-50 border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#bc2a24]/10 transition-all"
          >
            <option value="">Todas as Escolas</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
          <SchoolIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div 
          key={`${activeDay}-${activeSchoolId}`} 
          initial={{ opacity: 0, x: 10 }} 
          animate={{ opacity: 1, x: 0 }} 
          exit={{ opacity: 0, x: -10 }} 
          transition={{ duration: 0.2 }} 
          className="px-5 pt-8 pb-10"
        >
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-[#f7f7f7] h-24 animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-400 font-medium">Erro ao carregar a programação.</p>
              <button onClick={() => refetch()} className="mt-4 px-6 py-2 rounded-full border-2 border-[#bc2a24] text-[#bc2a24] text-xs font-black uppercase tracking-widest active:scale-95 transition-all">Tentar novamente</button>
            </div>
          )}

          {!isLoading && !error && events.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-sm text-gray-400 font-medium">Sem eventos para este filtro.</p>
            </div>
          )}

          {!isLoading && !error && events.length > 0 && (
            <div className="relative">
              <div className="absolute left-[38px] top-6 bottom-6 w-px bg-gray-100" />
              <div className="space-y-6">
                {events.map((event, index) => {
                  const typeInfo = eventTypes[event.type] || eventTypes.OTHER
                  const nowTime = new Date().getTime()
                  const start = new Date(event.startTime).getTime()
                  const end = event.endTime ? new Date(event.endTime).getTime() : start + (60 * 60 * 1000)
                  
                  // Strict active check:
                  // 1. Time is within bounds
                  // 2. Not a long-term exhibition (> 18h)
                  // 3. Current day matches event day
                  const durationHours = (end - start) / (1000 * 60 * 60)
                  const isNow = nowTime >= start && nowTime <= end && 
                                (new Date().getDate() === getDayLabel(event.day)) &&
                                durationHours <= 18

                  return (
                    <motion.div key={event.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex gap-5">
                      <div className="flex flex-col items-center w-[76px] flex-shrink-0">
                        <div className={`text-xs font-black tabular-nums ${isNow ? 'text-[#bc2a24]' : 'text-gray-900'}`}>{formatTime(event.startTime)}</div>
                        <div className={`w-3.5 h-3.5 rounded-full mt-2 z-10 ring-4 ring-white shadow-sm ${isNow ? 'animate-pulse scale-125' : ''}`} style={{ backgroundColor: isNow ? '#bc2a24' : typeInfo.color }} />
                        {event.endTime && <div className="text-[10px] font-bold text-gray-400 mt-2 tabular-nums">{formatTime(event.endTime)}</div>}
                      </div>
                      <div className={`flex-1 rounded-[2rem] p-5 border shadow-sm transition-all hover:shadow-md ${isNow ? 'border-[#bc2a24] bg-[#bc2a24]/5 ring-4 ring-[#bc2a24]/5' : event.featured ? 'border-[#bc2a24]/20 bg-[#fef8f8]' : 'border-gray-100 bg-white'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className={`inline-flex items-center gap-1.5 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-tighter ${isNow ? 'bg-[#bc2a24] text-white' : ''}`} style={!isNow ? { backgroundColor: typeInfo.color + '15', color: typeInfo.color } : {}}>
                            {typeInfo.emoji} {typeInfo.label}
                            </span>
                            {isNow && (
                                <div className="flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-[#bc2a24] animate-ping" />
                                    <span className="text-[8px] font-black text-[#bc2a24] uppercase tracking-widest">Agora</span>
                                </div>
                            )}
                            {!isNow && event.featured && <span className="w-1.5 h-1.5 rounded-full bg-[#bc2a24] animate-pulse" />}
                        </div>
                        <h3 className={`font-bold text-sm leading-tight ${isNow ? 'text-[#bc2a24]' : 'text-gray-900'}`}>{event.title}</h3>
                        {event.description && <p className="text-xs text-gray-500 mt-1.5 font-medium leading-relaxed">{event.description}</p>}
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                          {event.venue && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#bc2a24]" />
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{event.venue}</span>
                            </div>
                          )}
                          {event.school && (
                            <div className="flex items-center gap-1.5">
                              <SchoolIcon className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{event.school.name}</span>
                            </div>
                          )}
                        </div>
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
