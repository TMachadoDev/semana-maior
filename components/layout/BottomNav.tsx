'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Calendar, Trophy, GraduationCap, BarChart3 } from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: 'Início' },
  { href: '/schedule', icon: Calendar, label: 'Agenda' },
  { href: '/tournament', icon: Trophy, label: 'Torneio' },
  { href: '/leaderboard', icon: BarChart3, label: 'Ranking' },
  { href: '/courses', icon: GraduationCap, label: 'Cursos' },
]

export function BottomNav() {
  const pathname = usePathname()

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
      }}
    >
      <div className="flex items-center justify-around px-4 pt-3 pb-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = href === '/' ? pathname === href : pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} className="flex-1 relative">
              <div className="flex flex-col items-center gap-1.5 py-1">
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -top-3 left-0 right-0 h-1 bg-[#bc2a24] rounded-full mx-auto w-8"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30
                      }}
                    />
                  )}
                </AnimatePresence>
                
                <motion.div
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? 'text-[#bc2a24]' : 'text-gray-400'
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                </motion.div>
                <span
                  className={`text-[10px] font-bold tracking-tight transition-colors duration-200 ${
                    isActive ? 'text-[#bc2a24]' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
