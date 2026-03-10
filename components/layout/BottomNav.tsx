'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
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
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
      }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = href === '/' ? pathname === href : pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} className="flex-1">
              <div className="flex flex-col items-center gap-0.5 py-1 relative">
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[#bc2a24]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    color: isActive ? '#bc2a24' : '#9ca3af',
                  }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={isActive ? 2 : 1.5}
                    style={{ color: isActive ? '#bc2a24' : '#9ca3af' }}
                  />
                </motion.div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isActive ? '#bc2a24' : '#9ca3af' }}
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
