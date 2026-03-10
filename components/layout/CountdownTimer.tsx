'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

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

  useEffect(() => {
    setMounted(true)
    
    const checkStatus = () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      const day = now.getDate()
      
      // Live on March 26 and 27, 2026
      if (year === 2026 && month === 3 && (day === 26 || day === 27)) {
        setIsLive(true)
      } else {
        setIsLive(false)
      }
      
      setTimeLeft(calculateTimeLeft(targetDate))
    }

    checkStatus()
    const timer = setInterval(checkStatus, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  if (!mounted) return null

  return (
    <div className="rounded-3xl bg-[#f7f7f7] border border-gray-100 p-6 overflow-hidden relative">
      {/* Background Glow when live */}
      {isLive && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#bc2a24]/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
      )}

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Zap className={`w-4 h-4 ${isLive ? 'text-[#bc2a24]' : 'text-gray-400'}`} fill="currentColor" />
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
            {isLive ? 'Acontecendo Agora' : 'Contagem Regressiva'}
          </p>
        </div>
        {isLive && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#bc2a24]/10 border border-[#bc2a24]/10">
            <span className="w-1 h-1 rounded-full bg-[#bc2a24] animate-pulse" />
            <span className="text-[8px] font-black text-[#bc2a24] uppercase tracking-wider">LIVE</span>
          </div>
        )}
      </div>

      {!isLive ? (
        <div className="flex items-center justify-between gap-1">
          <TimeUnit value={timeLeft.days} label="dias" />
          <span className="text-gray-200 text-lg font-light mb-6">:</span>
          <TimeUnit value={timeLeft.hours} label="horas" />
          <span className="text-gray-200 text-lg font-light mb-6">:</span>
          <TimeUnit value={timeLeft.minutes} label="minutos" />
          <span className="text-gray-200 text-lg font-light mb-6">:</span>
          <TimeUnit value={timeLeft.seconds} label="segundos" />
        </div>
      ) : (
        <div className="py-2">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl font-black text-gray-900 leading-tight"
          >
            Semana Maior: <span className="text-[#bc2a24]">Acontecendo Agora</span>
          </motion.h3>
          <p className="text-gray-500 text-xs mt-1.5 font-medium">
            Acompanhe os resultados e a programação ao vivo pelo app.
          </p>
          <div className="mt-4 flex gap-2">
            <div className="h-1 flex-1 bg-[#bc2a24] rounded-full animate-pulse" />
            <div className="h-1 flex-1 bg-[#bc2a24]/20 rounded-full" />
            <div className="h-1 flex-1 bg-[#bc2a24]/20 rounded-full" />
          </div>
        </div>
      )}
    </div>
  )
}
