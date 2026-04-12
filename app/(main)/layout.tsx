'use client'

import { BottomNav } from '@/components/layout/BottomNav'
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt'
import { Credits } from '@/components/layout/Credits'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="relative max-w-md mx-auto bg-white min-h-screen shadow-2xl flex flex-col overflow-x-hidden">
      <Credits />
      <main className="flex-1 pb-24 relative">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.2,
              ease: "easeOut"
            }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
      <PWAInstallPrompt />
    </div>
  )
}
