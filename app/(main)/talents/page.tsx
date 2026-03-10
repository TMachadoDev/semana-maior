'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, MapPin, Star, Music, Headphones, Users, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'

interface Talent {
  id: string
  name: string
  type: string
  description?: string
  performAt?: string
  venue?: string
  featured: boolean
}

function formatTime(iso?: string) {
  if (!iso) return ''
  try { return new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) }
  catch { return iso }
}

function typeIcon(type: string) {
  const t = type.toLowerCase()
  if (t.includes('banda') || t.includes('band')) return Music
  if (t.includes('dj') || t.includes('eletrónica')) return Headphones
  return Users
}

const typeColors = ['#bc2a24', '#6366f1', '#0ea5e9', '#059669', '#d97706']

export default function TalentsPage() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/talents')
      if (!res.ok) throw new Error()
      setTalents(await res.json())
    } catch {
      setError('Erro ao carregar os talentos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const featured = talents.find(t => t.featured)

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Talentos" subtitle="Shows & Atrações" />

      {loading && (
        <div className="px-5 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#f7f7f7] h-24 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-gray-400">{error}</p>
          <button onClick={fetchData} className="mt-3 text-[#bc2a24] text-sm font-medium">Tentar novamente</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {featured && (
            <div className="px-5 mb-6">
              <div className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-[#bc2a24] text-[#bc2a24]" />
                Destaque da Noite
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-3xl overflow-hidden h-[200px] bg-[#0d0d0d]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(188,42,36,0.5),transparent_60%)]" />
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
                <div className="absolute top-6 right-6 w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <Music className="w-8 h-8 text-[#bc2a24]" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#bc2a24]/25 text-[#bc2a24]">{featured.type}</span>
                  <h3 className="font-display text-2xl font-bold text-white mt-1.5">{featured.name}</h3>
                  {featured.performAt && (
                    <div className="flex items-center gap-1 mt-2 text-white/50 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(featured.performAt)}</span>
                      {featured.venue && (<><span className="mx-1">·</span><MapPin className="w-3 h-3" /><span>{featured.venue}</span></>)}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {talents.length === 0 && (
            <div className="px-5 py-10 text-center text-gray-300 text-sm">Nenhuma atração ainda.</div>
          )}

          <div className="px-5 pb-8">
            {talents.length > 0 && <div className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">Todas as Atrações</div>}
            <div className="space-y-3">
              {talents.map((talent, i) => {
                const Icon = typeIcon(talent.type)
                const color = typeColors[i % typeColors.length]
                return (
                  <motion.div
                    key={talent.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white"
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '15' }}>
                      <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-sm text-gray-900">{talent.name}</h3>
                        {talent.featured && <Star className="w-3 h-3 fill-[#bc2a24] text-[#bc2a24] flex-shrink-0" />}
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">{talent.type}</p>
                      {talent.description && <p className="text-xs text-gray-500 line-clamp-1">{talent.description}</p>}
                      {(talent.performAt || talent.venue) && (
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {talent.performAt && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />{formatTime(talent.performAt)}
                            </span>
                          )}
                          {talent.venue && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" />{talent.venue}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
