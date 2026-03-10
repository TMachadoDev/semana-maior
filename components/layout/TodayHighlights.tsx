'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, ChevronRight, Zap, Loader2 } from 'lucide-react'
import Link from 'next/link'

const typeColors: Record<string, string> = {
  TOURNAMENT: '#bc2a24',
  CONCERT: '#6366f1',
  SHOWCASE: '#d97706',
  CEREMONY: '#0ea5e9',
  OTHER: '#6b7280',
}

const typeLabels: Record<string, string> = {
  TOURNAMENT: 'Torneio',
  CONCERT: 'Show',
  SHOWCASE: 'Apresentação',
  CEREMONY: 'Cerimônia',
  OTHER: 'Evento',
}

export function TodayHighlights() {
  const [highlights, setHighlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHighlights() {
      try {
        // Tentar buscar eventos do dia 1 primeiro
        let res = await fetch('/api/schedule?day=1')
        let data = await res.json()
        
        // Se não houver nada no dia 1, tentar dia 2
        if (data.length === 0) {
          res = await fetch('/api/schedule?day=2')
          data = await res.json()
        }
        
        // Pegar apenas os eventos em destaque (featured) ou os primeiros 3
        const featured = data.filter((e: any) => e.featured).slice(0, 4)
        const finalData = featured.length > 0 ? featured : data.slice(0, 3)
        
        setHighlights(finalData)
      } catch (error) {
        console.error('Error fetching highlights:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHighlights()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#bc2a24]" />
      </div>
    )
  }

  if (highlights.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#bc2a24]" fill="currentColor" />
          <h2 className="text-xs text-gray-400 uppercase tracking-widest font-medium">
            Destaques de Hoje
          </h2>
        </div>
        <Link href="/schedule">
          <div className="text-xs text-[#bc2a24] font-medium flex items-center gap-0.5 cursor-pointer">
            Ver tudo <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      <div className="space-y-3">
        {highlights.map((item, index) => {
          const startTime = new Date(item.startTime).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
          
          return (
            <Link key={item.id} href="/schedule">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-sm cursor-pointer"
              >
                {/* Time */}
                <div className="flex-shrink-0 w-12 text-center">
                  <div className="text-[#bc2a24] font-bold text-sm font-display">{startTime}</div>
                </div>

                {/* Divider */}
                <div className="flex-shrink-0 flex flex-col items-center gap-0.5 h-12">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200 mt-1.5" />
                  <div className="w-px flex-1 bg-gray-100" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: (typeColors[item.type] || '#6b7280') + '15',
                        color: typeColors[item.type] || '#6b7280',
                      }}
                    >
                      {typeLabels[item.type] || item.type}
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-gray-900 truncate">{item.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <p className="text-xs text-gray-400 truncate">{item.venue || 'Auditório'}</p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
