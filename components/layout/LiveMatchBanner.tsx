'use client'

import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, MapPin } from 'lucide-react'
import Link from 'next/link'

export function LiveMatchBanner() {
  const { data: matches = [] } = useQuery({
    queryKey: ['live-matches-banner'],
    queryFn: () => fetch('/api/matches?status=LIVE').then(res => res.json()),
    refetchInterval: 10000
  })

  if (matches.length === 0) return null

  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-2 px-1">
        <div className="w-1.5 h-1.5 rounded-full bg-[#bc2a24] animate-pulse" />
        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Torneios Ao Vivo</span>
      </div>
      
      <AnimatePresence mode="popLayout">
        {matches.map((match: any) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
          >
            <Link href="/tournament">
              <div className="bg-[#bc2a24] rounded-[2rem] p-5 text-white shadow-xl shadow-[#bc2a24]/20 relative overflow-hidden group active:scale-[0.98] transition-all">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-black bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/10">
                    {match.tournament?.name}
                  </span>
                  <div className="flex items-center gap-1.5 bg-white text-[#bc2a24] px-2.5 py-0.5 rounded-full shadow-lg">
                    <Zap className="w-2.5 h-2.5 fill-current" />
                    <span className="text-[9px] font-black uppercase">LIVE</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 px-2">
                  <div className="flex-1 text-center">
                    <p className="text-xs font-black uppercase truncate">{match.teamA?.name}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-1 rounded-2xl backdrop-blur-md border border-white/10">
                    <span className="text-2xl font-black tabular-nums">{match.teamAScore ?? 0}</span>
                    <span className="text-[10px] font-black opacity-40">VS</span>
                    <span className="text-2xl font-black tabular-nums">{match.teamBScore ?? 0}</span>
                  </div>

                  <div className="flex-1 text-center">
                    <p className="text-xs font-black uppercase truncate">{match.teamB?.name}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-4">
                   <div className="flex items-center gap-1 opacity-70">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">{match.location || 'Pavilhão ESSMM'}</span>
                   </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
