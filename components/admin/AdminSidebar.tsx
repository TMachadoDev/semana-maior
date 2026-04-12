'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Calendar, Trophy, Users,
  BarChart3, Music, Image, LogOut, Swords, Circle, Monitor, Smartphone
} from 'lucide-react'
import { usePresence } from '@/components/providers/PresenceProvider'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/schedule', icon: Calendar, label: 'Programação' },
  { href: '/admin/teams', icon: Trophy, label: 'Times' },
  { href: '/admin/matches', icon: Swords, label: 'Partidas' },
  { href: '/admin/talents', icon: Music, label: 'Talentos' },
  { href: '/admin/gallery', icon: Image, label: 'Galeria' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { members, onlineCount } = usePresence()

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#bc2a24] flex items-center justify-center">
            <span className="text-white font-black text-xs">SM</span>
          </div>
          <div>
            <div className="font-bold text-xs text-gray-900">Semana Maior</div>
            <div className="text-[10px] text-gray-400">Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-gray-400 px-3 mb-2 uppercase tracking-wider">Menu Principal</div>
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}>
              <div
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#bc2a24] text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                {label}
              </div>
            </Link>
          )
        })}

        {/* Online Users Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between px-3 mb-3">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Online Agora ({onlineCount})</div>
            <Circle className="w-2 h-2 text-green-500 fill-green-500 animate-pulse" />
          </div>
          
          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {members.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-400 italic">Ninguém online</div>
            ) : (
              members.map((member) => (
                <div key={member.clientId} className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-700 truncate">{member.name}</span>
                  </div>
                  {member.type === 'app' ? (
                    <Smartphone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  ) : (
                    <Monitor className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 border-t border-gray-100 pt-4">
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50 mb-1">
          <span>← Ver site</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
