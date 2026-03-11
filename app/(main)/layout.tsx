import { BottomNav } from '@/components/layout/BottomNav'
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden">
      <main className="pb-24 scroll-container">
        {children}
      </main>
      <BottomNav />
      <PWAInstallPrompt />
    </div>
  )
}
