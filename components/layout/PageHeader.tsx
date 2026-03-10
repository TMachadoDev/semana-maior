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
      className="px-5 pt-14 pb-4"
    >
      {showBack && (
        <button
          onClick={() => router.back()}
          className="mb-4 -ml-1 flex items-center gap-1 text-[#bc2a24] text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      )}
      <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">{subtitle}</p>
      <h1 className="font-display text-3xl font-bold text-gray-900 mt-1">{title}</h1>
    </motion.div>
  )
}
