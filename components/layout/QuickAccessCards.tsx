'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Trophy, BarChart3, GraduationCap, Image, Shield } from 'lucide-react'

const cards = [
  {
    href: '/schedule',
    icon: Calendar,
    label: 'Programação',
    description: 'Ver agenda completa',
    bg: '#bc2a24',
    textColor: 'white',
  },
  {
    href: '/tournament',
    icon: Trophy,
    label: 'Torneios',
    description: 'Brackets & resultados',
    bg: '#0d0d0d',
    textColor: 'white',
  },
  {
    href: '/leaderboard',
    icon: BarChart3,
    label: 'Ranking',
    description: 'Classificação ao vivo',
    bg: '#f7f7f7',
    textColor: '#0d0d0d',
    border: true,
  },
  {
    href: '/talents',
    icon: GraduationCap,
    label: 'Talentos',
    description: 'Shows & atrações',
    bg: '#f7f7f7',
    textColor: '#0d0d0d',
    border: true,
  },
  {
    href: '/gallery',
    icon: Image,
    label: 'Galeria',
    description: 'Fotos do evento',
    bg: '#f7f7f7',
    textColor: '#0d0d0d',
    border: true,
  },
  {
    href: '/admin',
    icon: Shield,
    label: 'Admin',
    description: 'Painel de controle',
    bg: '#f7f7f7',
    textColor: '#0d0d0d',
    border: true,
  },
]

export function QuickAccessCards() {
  return (
    <div>
      <h2 className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">
        Acesso Rápido
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {/* Large cards */}
        {cards.slice(0, 2).map((card, i) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link href={card.href}>
              <div
                className="rounded-2xl p-4 h-[120px] flex flex-col justify-between hover-lift cursor-pointer"
                style={{
                  backgroundColor: card.bg,
                  border: card.border ? '1px solid #e5e5e5' : 'none',
                }}
              >
                <card.icon
                  className="w-6 h-6"
                  style={{ color: card.textColor }}
                  strokeWidth={1.5}
                />
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: card.textColor }}
                  >
                    {card.label}
                  </p>
                  <p
                    className="text-xs mt-0.5 opacity-60"
                    style={{ color: card.textColor }}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {/* Small cards grid */}
        <div className="col-span-2 grid grid-cols-4 gap-3">
          {cards.slice(2).map((card, i) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + 0.08 * i, duration: 0.4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={card.href}>
                <div
                  className="rounded-2xl p-3 h-[80px] flex flex-col justify-between hover-lift cursor-pointer"
                  style={{
                    backgroundColor: card.bg,
                    border: card.border ? '1px solid #e5e5e5' : 'none',
                  }}
                >
                  <card.icon
                    className="w-5 h-5"
                    style={{ color: card.textColor }}
                    strokeWidth={1.5}
                  />
                  <p
                    className="font-medium text-[11px] leading-tight"
                    style={{ color: card.textColor }}
                  >
                    {card.label}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
