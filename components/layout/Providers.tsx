'use client'

import { SessionProvider } from 'next-auth/react'
import { Tracker } from './Tracker'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Tracker />
      {children}
    </SessionProvider>
  )
}
