import { Calendar, Trophy, Users, Music, BarChart3, Image, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { label: 'Eventos', value: '9', icon: Calendar, href: '/admin/schedule', color: '#bc2a24' },
  { label: 'Times', value: '8', icon: Trophy, href: '/admin/teams', color: '#6366f1' },
  { label: 'Jogadores', value: '48', icon: Users, href: '/admin/teams', color: '#059669' },
  { label: 'Talentos', value: '4', icon: Music, href: '/admin/talents', color: '#d97706' },
  { label: 'Partidas', value: '12', icon: BarChart3, href: '/admin/matches', color: '#0ea5e9' },
  { label: 'Fotos', value: '0', icon: Image, href: '/admin/gallery', color: '#374151' },
]

const recentActions = [
  { action: 'Resultado atualizado', detail: 'Informática 3×1 Mecânica', time: '5 min atrás' },
  { action: 'Evento criado', detail: 'Show de Talentos — 14:00', time: '1 hora atrás' },
  { action: 'Time adicionado', detail: 'Química Titans', time: '2 horas atrás' },
]

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
        <p className="text-gray-500 mt-1 text-sm">Gerencie todos os aspectos da Semana Maior</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#bc2a24]/20 hover:shadow-md transition-all duration-200 cursor-pointer group">
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
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#bc2a24] rounded-2xl p-5 text-white">
          <h3 className="font-bold text-lg mb-1">Semana Maior</h3>
          <p className="text-white/70 text-sm mb-4">26–27 de Março de 2025</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm font-medium">Evento em preparação</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3">Ações Rápidas</h3>
          <div className="space-y-2">
            {[
              { label: 'Adicionar Resultado', href: '/admin/matches' },
              { label: 'Novo Evento na Agenda', href: '/admin/schedule' },
              { label: 'Gerir Times', href: '/admin/teams' },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <div className="flex items-center justify-between py-1.5 text-sm text-gray-700 hover:text-[#bc2a24] transition-colors cursor-pointer">
                  <span>{action.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-900">Atividade Recente</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {recentActions.map((item, i) => (
            <div key={i} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.action}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
              </div>
              <span className="text-xs text-gray-300">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
