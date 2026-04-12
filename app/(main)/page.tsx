'use client'

import { motion } from 'framer-motion'
import { LiveStatus } from '@/components/layout/LiveStatus'
import { LiveMatchBanner } from '@/components/layout/LiveMatchBanner'
import { QuickAccessCards } from '@/components/layout/QuickAccessCards'
import { DynamicHighlights } from '@/components/layout/DynamicHighlights'
import { HeroSection } from '@/components/layout/HeroSection'
import { SupportSection } from '@/components/layout/SupportSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />

      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="px-5 pt-6"
        >
          <LiveStatus />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="px-5 pt-6"
        >
          <LiveMatchBanner />
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
          <div className="mb-6 h-px bg-gray-50 w-full" />
          <DynamicHighlights />
        </motion.div>

        <SupportSection />
      </div>
    </div>
  )
}
