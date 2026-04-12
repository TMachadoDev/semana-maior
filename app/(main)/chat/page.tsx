'use client'

import { PageHeader } from '@/components/layout/PageHeader'
import { GlobalChat } from '@/components/chat/GlobalChat'

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f7] pb-24">
      <PageHeader 
        title="Chat Global" 
        subtitle="Comunidade" 
        showBack={true} 
      />
      
      <div className="px-2 sm:px-5">
        <GlobalChat />
      </div>
    </main>
  )
}
