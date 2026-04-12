'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import * as Ably from 'ably'

interface OnlineMember {
  clientId: string
  name: string
  type: 'app' | 'site'
}

interface PresenceContextType {
  onlineCount: number
  stats: {
    app: number
    site: number
  }
  members: OnlineMember[]
}

const PresenceContext = createContext<PresenceContextType>({
  onlineCount: 0,
  stats: { app: 0, site: 0 },
  members: []
})

export const usePresence = () => useContext(PresenceContext)

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const [onlineCount, setOnlineCount] = useState(0)
  const [stats, setStats] = useState({ app: 0, site: 0 })
  const [members, setMembers] = useState<OnlineMember[]>([])

  useEffect(() => {
    const isStandalone = typeof window !== 'undefined' && 
      (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone)
    
    const clientType = isStandalone ? 'app' : 'site'
    const storedName = typeof window !== 'undefined' ? localStorage.getItem('sm_user_name') : null
    
    // Se não houver nome, não entra na presença ainda (espera o NamePrompt)
    if (!storedName && typeof window !== 'undefined') return

    const ably = new Ably.Realtime({ 
        key: 'MJzqBA.e9ChAg:7HYGpPaWV-EeyscZi75DJXcJP6WkCYkmmKcHVYAvslQ',
        clientId: `user-${Math.random().toString(36).substring(7)}`
    })
    
    const channel = ably.channels.get('presence-tracking')

    const updatePresence = async () => {
      try {
        if (channel.state === 'attached' || channel.state === 'attaching') {
            const presenceMembers = await channel.presence.get()
            setOnlineCount(presenceMembers.length)
            
            const newStats = { app: 0, site: 0 }
            const activeMembers: OnlineMember[] = []

            presenceMembers.forEach((member: any) => {
                const type = member.data?.type || 'site'
                const name = member.data?.name || 'Utilizador Anónimo'
                
                if (type === 'app' || type === 'site') {
                    newStats[type as 'app' | 'site']++
                }
                
                activeMembers.push({
                    clientId: member.clientId,
                    name: name,
                    type: type as 'app' | 'site'
                })
            })
            
            setStats(newStats)
            setMembers(activeMembers)
        }
      } catch (e) {
        // Silently handle error
      }
    }

    ably.connection.on('connected', () => {
        channel.presence.enter({ 
            type: clientType,
            name: storedName || 'Anónimo'
        }).then(() => {
            updatePresence()
        }).catch(() => {})
    })

    channel.presence.subscribe(['enter', 'leave', 'update'], () => {
      updatePresence()
    })

    return () => {
      ably.close()
    }
  }, [])

  return (
    <PresenceContext.Provider value={{ onlineCount, stats, members }}>
      {children}
    </PresenceContext.Provider>
  )
}
