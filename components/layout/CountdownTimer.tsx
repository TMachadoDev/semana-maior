'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Clock, MapPin, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface CountdownProps {
  targetDate: Date
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(target: Date): TimeLeft {
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <motion.div
          key={value}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-16 h-16 rounded-2xl bg-[#0d0d0d] flex items-center justify-center shadow-lg"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <span className="text-white font-display text-2xl font-bold tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
        </motion.div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      </div>
      <span className="mt-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
        {label}
      </span>
    </div>
  )
}

export function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate))
  const [isLive, setIsLive] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { data: allEvents = [] } = useQuery({
    queryKey: ['schedule'],
    queryFn: () => fetch('/api/schedule').then(res => res.json()),
    refetchInterval: 30000 // Refresh every 30s to keep "Now" accurate
  })

  useEffect(() => {
    setMounted(true)
    
    const checkStatus = () => {
      const now = new Date()
      // Use Intl to get accurate Portugal time components
      const ptDate = new Intl.DateTimeFormat('pt-PT', {
        timeZone: 'Europe/Lisbon',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }).formatToParts(now)
      
      const year = parseInt(ptDate.find(p => p.type === 'year')?.value || '0')
      const month = parseInt(ptDate.find(p => p.type === 'month')?.value || '0')
      const day = parseInt(ptDate.find(p => p.type === 'day')?.value || '0')
      
      const eventDays = [23, 24, 25, 26, 27]
      const isEventWeek = year === 2026 && month === 3 && eventDays.includes(day)
      
      setIsLive(isEventWeek)
      setTimeLeft(calculateTimeLeft(targetDate))
    }

    checkStatus()
    const timer = setInterval(checkStatus, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  if (!mounted) return null

  const nowTime = new Date().getTime()
  
  // Events happening right now
  const currentEvents = allEvents.filter((event: any) => {
    const start = new Date(event.startTime).getTime()
    const end = event.endTime ? new Date(event.endTime).getTime() : start + (60 * 60 * 1000)
    return nowTime >= start && nowTime <= end
  })

  // Next event coming up
  const nextEvent = allEvents
    .filter((event: any) => new Date(event.startTime).getTime() > nowTime)
    .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0]

  return (
    <div className="rounded-[2.5rem] bg-white border border-gray-100 p-7 overflow-hidden relative shadow-xl shadow-black/[0.02]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">
            Contagem Regressiva
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1 px-2">
        <TimeUnit value={timeLeft.days} label="dias" />
        <span className="text-gray-200 text-xl font-light mb-6">:</span>
        <TimeUnit value={timeLeft.hours} label="horas" />
        <span className="text-gray-200 text-xl font-light mb-6">:</span>
        <TimeUnit value={timeLeft.minutes} label="minutos" />
        <span className="text-gray-200 text-xl font-light mb-6">:</span>
        <TimeUnit value={timeLeft.seconds} label="segundos" />
      </div>
    </div>
  )
}
