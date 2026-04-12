'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Clock, MapPin, School as SchoolIcon, Loader2, History } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface LiveStatusProps {
  // Can be empty as it will use react-query to fetch global state
}

export function LiveStatus({}: LiveStatusProps) {
  const [currentSchoolIdx, setCurrentSchoolIdx] = useState(0)
  const [mounted, setMounted] = useState(false)

  const { data: allEvents = [], isLoading } = useQuery({
    queryKey: ['schedule-live'],
    queryFn: () => fetch('/api/schedule').then(res => res.json()),
    refetchInterval: 15000 // High frequency for live feel
  })

  // List of schools to rotate through
  const schools = useMemo(() => ['Secundária', 'Frei', 'Carmo'], [])

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCurrentSchoolIdx((prev) => (prev + 1) % schools.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [schools.length])

  if (!mounted || isLoading) {
    return (
      <div className="rounded-[2.5rem] bg-white border border-gray-100 p-8 flex items-center justify-center h-48 shadow-sm">
        <Loader2 className="w-6 h-6 animate-spin text-[#bc2a24]" />
      </div>
    )
  }

  const now = new Date()
  const nowTime = now.getTime()
  
  // Get current hour in Portugal to check if school is open
  const ptHour = parseInt(new Intl.DateTimeFormat('pt-PT', {
    timeZone: 'Europe/Lisbon',
    hour: 'numeric',
    hour12: false
  }).format(now))
  
  const isSchoolOpen = ptHour >= 8 && ptHour < 20
  const currentSchool = schools[currentSchoolIdx]

  // Find what's happening now in THIS school
  const liveEvent = isSchoolOpen ? allEvents.find((event: any) => {
    const schoolMatch = event.school?.name === currentSchool
    const start = new Date(event.startTime).getTime()
    const end = event.endTime ? new Date(event.endTime).getTime() : start + (60 * 60 * 1000)
    
    // Duration check: ignore exhibitions (> 18h)
    const durationHours = (end - start) / (1000 * 60 * 60)
    if (durationHours > 18) return false

    return schoolMatch && nowTime >= start && nowTime <= end
  }) : null

  // If nothing live, find the last activity in THIS school
  const lastEvent = !liveEvent ? [...allEvents]
    .filter((event: any) => {
      const schoolMatch = event.school?.name === currentSchool
      const start = new Date(event.startTime).getTime()
      const end = event.endTime ? new Date(event.endTime).getTime() : start + (60 * 60 * 1000)
      const durationHours = (end - start) / (1000 * 60 * 60)
      return schoolMatch && start < nowTime && durationHours <= 18
    })
    .sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0] : null

  // Calculate time remaining for live event
  const getTimeRemaining = (endTimeStr: string | null, startTimeStr: string) => {
    const end = endTimeStr ? new Date(endTimeStr).getTime() : new Date(startTimeStr).getTime() + (60 * 60 * 1000)
    const diff = end - nowTime
    
    if (diff <= 0) return 'A terminar...'
    
    const totalMinutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}m`
    }
    return `${minutes} min`
  }

  return (
    <div className="rounded-[2.5rem] bg-white border border-gray-100 p-7 overflow-hidden relative shadow-xl shadow-black/[0.02] min-h-[220px] flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
             <SchoolIcon className="w-4 h-4" />
          </div>
          <motion.p 
            key={currentSchool}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black"
          >
            Escola: {currentSchool}
          </motion.p>
        </div>
        
        <AnimatePresence mode="wait">
          {liveEvent ? (
            <motion.div 
              key="live-tag"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#bc2a24] shadow-lg shadow-[#bc2a24]/20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[9px] font-black text-white uppercase tracking-wider">AGORA</span>
            </motion.div>
          ) : (
             <motion.div 
              key="history-tag"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200"
            >
              <History className="w-3 h-3 text-gray-400" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">ÚLTIMA</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSchool + (liveEvent?.id || lastEvent?.id || 'empty')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="space-y-4"
          >
            {liveEvent ? (
              <div className="space-y-3">
                <h3 className="font-display text-2xl font-black text-gray-900 leading-[1.1] tracking-tight">
                  {liveEvent.title}
                </h3>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-2xl border border-red-100 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-[#bc2a24]" />
                    <span className="text-[11px] font-black text-[#bc2a24] tabular-nums">
                      Faltam {getTimeRemaining(liveEvent.endTime, liveEvent.startTime)}
                    </span>
                  </div>
                  {liveEvent.venue && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      <MapPin className="w-3.5 h-3.5 text-gray-300" />
                      {liveEvent.venue}
                    </div>
                  )}
                </div>
              </div>
            ) : lastEvent ? (
              <div className="space-y-3">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Sem atividades no momento</p>
                    <h3 className="font-display text-xl font-black text-gray-400 leading-tight">
                      {lastEvent.title}
                    </h3>
                 </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                    <Clock className="w-3.5 h-3.5" />
                    Terminou às {new Date(lastEvent.endTime || lastEvent.startTime).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-gray-300 text-sm font-black uppercase tracking-[0.1em]">A aguardar programação...</p>
                <div className="w-12 h-1 bg-gray-50 rounded-full mt-4 overflow-hidden">
                   <motion.div 
                    animate={{ x: [-48, 48] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full bg-gray-200"
                   />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress indicators for schools */}
      <div className="flex gap-1.5 mt-6">
        {schools.map((s, idx) => (
          <div key={s} className="flex-1 h-1 rounded-full bg-gray-50 overflow-hidden">
            {idx === currentSchoolIdx && (
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
                className="h-full bg-[#bc2a24]"
              />
            )}
            {idx < currentSchoolIdx && <div className="w-full h-full bg-gray-200" />}
          </div>
        ))}
      </div>
    </div>
  )
}
