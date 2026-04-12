'use client'

import { Calendar, Trophy, Users, Music, BarChart3, Image, ArrowUpRight, CheckCircle2, Globe, Smartphone, Activity, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { courses } from '@/lib/courses-data'
import { motion } from 'framer-motion'
import { usePresence } from '@/components/providers/PresenceProvider'
import { useQuery } from '@tanstack/react-query'

export default function AdminDashboard() {
  const { onlineCount, stats: presenceStats } = usePresence()

  const { data: votes = [], isLoading: votesLoading } = useQuery({
    queryKey: ['votes'],
    queryFn: () => fetch('/api/courses/vote').then(res => res.json())
  })

  const { data: realStats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => fetch('/api/admin/stats').then(res => res.json())
  })

  const totalVotes = votes.reduce((acc: number, curr: any) => acc + curr._count.id, 0)

  const stats_config = [
    { label: 'Eventos', value: realStats?.events ?? '0', icon: Calendar, href: '/admin/schedule', color: '#bc2a24' },
    { label: 'Times', value: realStats?.teams ?? '0', icon: Trophy, href: '/admin/teams', color: '#6366f1' },
    { label: 'Jogadores', value: realStats?.players ?? '0', icon: Users, href: '/admin/teams', color: '#059669' },
    { label: 'Talentos', value: realStats?.talents ?? '0', icon: Music, href: '/admin/talents', color: '#d97706' },
    { label: 'Partidas', value: realStats?.matches ?? '0', icon: BarChart3, href: '/admin/matches', color: '#0ea5e9' },
    { label: 'Fotos', value: realStats?.gallery ?? '0', icon: Image, href: '/admin/gallery', color: '#374151' },
  ]

  return (
    <div className="max-w-4xl pb-20">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-500 mt-1 text-sm">Gerencie todos os aspectos da Semana Maior</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-2xl border border-green-100 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold text-green-700">{onlineCount} Alunos Online</span>
        </div>
      </div>

      {/* Real-time Presence Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Via App (PWA)</p>
                    <p className="text-2xl font-black text-gray-900">{presenceStats.app}</p>
                </div>
            </div>
            <Activity className="w-5 h-5 text-gray-100" />
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Via Website</p>
                    <p className="text-2xl font-black text-gray-900">{presenceStats.site}</p>
                </div>
            </div>
            <Activity className="w-5 h-5 text-gray-100" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse h-32" />
            ))
        ) : (
            stats_config.map((stat) => (
            <Link key={stat.label} href={stat.href}>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#bc2a24]/20 hover:shadow-md transition-all duration-200 cursor-pointer group shadow-sm h-full">
                <div className="flex items-center justify-between mb-3">
                    <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: stat.color + '15' }}
                    >
                    <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#bc2a24] transition-colors" />
                </div>
                <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                </div>
            </Link>
            ))
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Event Card */}
        <div className="bg-[#bc2a24] rounded-[2.5rem] p-8 text-white shadow-xl shadow-[#bc2a24]/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <h3 className="font-bold text-2xl mb-1">Semana Maior 2026</h3>
          <p className="text-white/70 text-sm mb-6">23, 24, 25, 26 e 27 de Março (5 dias)</p>
          <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Em Preparação</span>
          </div>
        </div>

        {/* Course Poll Results */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-gray-900">Sondagem de Cursos</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded-full">
              {totalVotes} votos
            </span>
          </div>
          
          <div className="space-y-4">
            {courses.map((course) => {
              const courseVotes = votes.find((v: any) => v.courseId === course.id)?._count.id || 0
              const percentage = totalVotes > 0 ? (courseVotes / totalVotes) * 100 : 0
              
              return (
                <div key={course.id}>
                  <div className="flex justify-between items-end mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{course.emoji}</span>
                      <span className="text-xs font-bold text-gray-700">{course.shortName}</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-400">{courseVotes} votos</span>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

   
    </div>
  )
}
