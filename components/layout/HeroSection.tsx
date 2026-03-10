'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export function HeroSection() {
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const checkLive = () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1 // 0-indexed
      const day = now.getDate()
      
      // Live on March 26 and 27, 2026
      if (year === 2026 && month === 3 && (day === 26 || day === 27)) {
        setIsLive(true)
      } else {
        setIsLive(false)
      }
    }

    checkLive()
    const timer = setInterval(checkLive, 1000 * 60) // Check every minute
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-[52vh] min-h-[340px] overflow-hidden bg-[#0d0d0d]">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#bc2a24] via-[#8a1f1b] to-[#0d0d0d]" />
        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[80%] bg-[radial-gradient(ellipse_at_top,rgba(188,42,36,0.5),transparent_70%)]" />
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-20 bg-noise" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 right-8 w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(255,100,90,0.3),transparent_70%)]"
      />
      <motion.div
        animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-12 left-4 w-24 h-24 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_70%)]"
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-8 pt-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#bc2a24] backdrop-blur-sm border border-white/20 text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-[#bc2a24]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Acontecendo Agora ao Vivo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-medium tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b6b] animate-pulse" />
              26–27 Março 2026
            </span>
          )}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3"
        >
          <h1 className="font-display text-white leading-[0.9]">
            <span className="block text-5xl font-black tracking-tight">Semana</span>
            <span className="block text-5xl font-black tracking-tight text-[#ff9492]">Maior</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-3 text-white/60 text-sm font-body font-light tracking-wide max-w-[240px]"
        >
          {isLive 
            ? "Acompanhe todos os eventos em tempo real diretamente pelo app."
            : "Torneios, shows, talentos e muito mais. A maior semana do ano."}
        </motion.p>

        {/* Meta chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-5 flex items-center gap-3"
        >
          <div className="flex items-center gap-1.5 text-white/50 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>2 dias</span>
          </div>
          <span className="text-white/20">·</span>
          <div className="flex items-center gap-1.5 text-white/50 text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>Campus Principal</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </div>
  )
}
