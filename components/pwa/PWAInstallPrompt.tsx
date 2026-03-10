'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Share, Plus, ShieldCheck, Sparkles } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Verificar se já está instalado/rodando como app
    const checkStandalone = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://')
      setIsStandalone(standalone)
    }

    checkStandalone()

    const ios = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
    setIsIOS(ios)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert('Por favor, use o menu do seu navegador para instalar a aplicação.')
      return
    }
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      // O navegador vai fechar a aba e abrir o app em muitos casos
    }
    setDeferredPrompt(null)
  }

  // Se já estiver instalado ou não estiver montado (SSR), não mostra nada
  if (!mounted || isStandalone) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0d0d0d] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-[radial-gradient(ellipse_at_top,rgba(188,42,36,0.3),transparent_70%)]" />
      <div className="absolute inset-0 opacity-20 bg-noise" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo Icon */}
        <div className="relative inline-block mb-8">
          <div className="w-24 h-24 rounded-[32px] bg-[#bc2a24] flex items-center justify-center shadow-2xl shadow-[#bc2a24]/40 rotate-3">
            <span className="text-white font-display text-4xl font-black -rotate-3">SM</span>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-[#bc2a24]" />
          </motion.div>
        </div>

        <h1 className="text-white font-display text-3xl font-black leading-tight mb-3">
          Instala o App da <br />
          <span className="text-[#ff6b6b]">Semana Maior</span>
        </h1>
        
        <p className="text-gray-400 text-sm mb-10 px-4 leading-relaxed">
          Para garantir a melhor experiência e receber notificações em tempo real, precisas de instalar a aplicação no teu telemóvel.
        </p>

        <div className="space-y-4">
          {isIOS ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-[#ff6b6b]" />
                <p className="text-xs font-bold text-white uppercase tracking-widest">Instruções para iPhone</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
                  <p className="text-sm text-gray-300">Toca no botão de <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-white/10 text-white"><Share className="w-3 h-3 mr-1 text-blue-400" /> Partilhar</span> em baixo.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
                  <p className="text-sm text-gray-300">Desliza e seleciona <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-white/10 text-white"><Plus className="w-3 h-3 mr-1" /> Adicionar ao Ecrã Inicial</span>.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
                  <p className="text-sm text-gray-300">Toca em <strong>Adicionar</strong> no canto superior direito.</p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="group relative w-full py-5 rounded-[24px] bg-[#bc2a24] text-white font-bold text-lg flex items-center justify-center gap-3 overflow-hidden shadow-2xl shadow-[#bc2a24]/30 active:scale-95 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <Download className="w-6 h-6" />
              Instalar Agora
            </button>
          )}
        </div>

        {/* Feature badges */}
     
      </motion.div>

      {/* Security notice */}
      <div className="absolute bottom-10 left-0 right-0 px-6">
        <p className="text-[10px] text-gray-600 font-medium uppercase tracking-[0.2em]">
          100% Seguro - Sem permissões invasivas
        </p>
      </div>
    </div>
  )
}
