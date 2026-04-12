'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Image as ImageIcon, Trophy, Music, ArrowRight, Clock, MapPin, Activity } from 'lucide-react'

export function DynamicHighlights() {
  const { data: gallery = [], isLoading: galleryLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => fetch('/api/gallery').then(res => res.json())
  })

  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: () => fetch('/api/matches').then(res => res.json())
  })

  const { data: talents = [], isLoading: talentsLoading } = useQuery({
    queryKey: ['talents'],
    queryFn: () => fetch('/api/talents').then(res => res.json())
  })

  const isLoading = galleryLoading || matchesLoading || talentsLoading

  if (isLoading) return (
    <div className="space-y-6">
      <div className="h-40 bg-gray-50 animate-pulse rounded-3xl" />
      <div className="h-40 bg-gray-50 animate-pulse rounded-3xl" />
    </div>
  )

  const galleryHighlights = gallery.slice(0, 2)
  
  // Find most relevant match (LIVE first, then latest FINISHED, then first SCHEDULED)
  const matchHighlight = 
    matches.find((m: any) => m.status === 'LIVE') || 
    [...matches].reverse().find((m: any) => m.status === 'FINISHED') || 
    matches[0]

  const talentHighlight = talents.find((t: any) => t.featured) || talents[0]

  return (
    <div className="space-y-8 pb-10">
      {/* Gallery Highlight */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm border border-blue-100">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h2 className="font-black text-gray-900 tracking-tight">Galeria Recente</h2>
          </div>
          <Link href="/gallery" className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1 bg-blue-50/50 px-2 py-1 rounded-full border border-blue-100/50 active:scale-95 transition-all">
            Ver Tudo <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {galleryHighlights.map((img: any, i: number) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="aspect-square rounded-[2rem] overflow-hidden bg-gray-100 shadow-sm border border-gray-100 relative group"
            >
              <img src={img.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Match Highlight */}
      {matchHighlight && (
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm border border-orange-100">
                <Trophy className="w-4 h-4" />
              </div>
              <h2 className="font-black text-gray-900 tracking-tight">Resultados Recentes</h2>
            </div>
            <Link href="/tournament" className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1 bg-orange-50/50 px-2 py-1 rounded-full border border-orange-100/50 active:scale-95 transition-all">
              Torneio <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] p-7 border border-gray-100 shadow-xl shadow-black/[0.02] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 flex flex-col items-end gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 shadow-sm">
                    <Activity className="w-3 h-3 text-[#bc2a24]" />
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{matchHighlight.tournament?.sport || 'Futsal'}</span>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 mt-2">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl shadow-sm border border-gray-100">
                   {matchHighlight.teamA?.logoUrl ? <img src={matchHighlight.teamA.logoUrl} className="w-8 h-8 object-contain" /> : '⚽'}
                </div>
                <span className="text-[10px] font-black text-gray-900 uppercase text-center truncate w-full px-1">{matchHighlight.teamA?.name}</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <span className={matchHighlight.status === 'LIVE' ? 'text-[#bc2a24]' : ''}>{matchHighlight.teamAScore ?? '-'}</span>
                  <span className="text-gray-200 font-light">:</span>
                  <span className={matchHighlight.status === 'LIVE' ? 'text-[#bc2a24]' : ''}>{matchHighlight.teamBScore ?? '-'}</span>
                </div>
                <div className={`px-2 py-0.5 rounded-full border ${matchHighlight.status === 'LIVE' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${matchHighlight.status === 'LIVE' ? 'text-[#bc2a24]' : 'text-gray-400'}`}>
                    {matchHighlight.status === 'LIVE' ? 'AO VIVO' : matchHighlight.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl shadow-sm border border-gray-100">
                  {matchHighlight.teamB?.logoUrl ? <img src={matchHighlight.teamB.logoUrl} className="w-8 h-8 object-contain" /> : '⚽'}
                </div>
                <span className="text-[10px] font-black text-gray-900 uppercase text-center truncate w-full px-1">{matchHighlight.teamB?.name}</span>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Talent Highlight */}
      {talentHighlight && (
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 shadow-sm border border-purple-100">
                <Music className="w-4 h-4" />
              </div>
              <h2 className="font-black text-gray-900 tracking-tight">Destaque de Talento</h2>
            </div>
            <Link href="/talents" className="text-[10px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-1 bg-purple-50/50 px-2 py-1 rounded-full border border-purple-100/50 active:scale-95 transition-all">
              Ver Todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] p-5 border border-gray-100 shadow-xl shadow-black/[0.02] flex items-center gap-4 group"
          >
            <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-gray-100 flex-shrink-0 shadow-lg shadow-black/5">
              <img src={talentHighlight.imageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop'} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-gray-900 text-lg leading-tight truncate">{talentHighlight.name}</h3>
              <p className="text-xs text-gray-400 font-medium mt-1 line-clamp-1">{talentHighlight.description}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <div className="flex items-center gap-1 text-[9px] font-black text-purple-500 bg-purple-50 px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                   <Clock className="w-3 h-3" />
                   {talentHighlight.performAt ? new Date(talentHighlight.performAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : 'Em breve'}
                </div>
                <div className="flex items-center gap-1 text-[9px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                   <MapPin className="w-3 h-3" />
                   {talentHighlight.venue || 'Auditório'}
                </div>
                {talentHighlight.school && (
                  <div className="flex items-center gap-1 text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                    {talentHighlight.school.name}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  )
}
