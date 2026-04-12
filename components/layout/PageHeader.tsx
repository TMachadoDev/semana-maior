'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
}

export function PageHeader({ title, subtitle, showBack = false }: PageHeaderProps) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 pt-16 pb-6"
    >
      {showBack && (
        <button
          onClick={() => router.back()}
          className="mb-5 -ml-1 flex items-center gap-1.5 text-[#bc2a24] text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      )}
      <p className="text-[10px] text-[#bc2a24] uppercase tracking-[0.2em] font-bold opacity-80">{subtitle}</p>
      <h1 className="font-display text-4xl font-black text-gray-900 mt-1.5 tracking-tight">{title}</h1>
    </motion.div>
  )
}
