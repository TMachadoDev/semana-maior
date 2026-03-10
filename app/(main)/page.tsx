'use client'

import { motion } from 'framer-motion'
import { CountdownTimer } from '@/components/layout/CountdownTimer'
import { QuickAccessCards } from '@/components/layout/QuickAccessCards'
import { TodayHighlights } from '@/components/layout/TodayHighlights'
import { HeroSection } from '@/components/layout/HeroSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="px-5 pt-6 pb-4"
      >
        <CountdownTimer targetDate={new Date('2026-03-26T09:00:00')} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="px-5 py-4"
      >
        <QuickAccessCards />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="px-5 py-4"
      >
        <TodayHighlights />
      </motion.div>
    </div>
  )
}
