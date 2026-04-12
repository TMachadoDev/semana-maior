'use client'

import { motion } from 'framer-motion'
import { Instagram, HelpCircle, MessageCircle } from 'lucide-react'

export function SupportSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="px-5 py-8"
    >
      <div className="bg-[#bc2a24] rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl shadow-[#bc2a24]/20">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-2xl" />

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl mb-4 border border-white/30">
            <HelpCircle className="w-7 h-7 text-white" />
          </div>
          
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
            Problemas ou Dúvidas?
          </h3>
          
          <p className="text-white/80 text-sm leading-relaxed mb-8 font-medium">
            Estamos aqui para ajudar! Se tiveres qualquer problema com a aplicação ou dúvidas sobre a Semana Maior, podes contactar-nos diretamente.
          </p>

          <div className="grid grid-cols-1 gap-3">
            <a 
              href="https://instagram.com/im.machado.18" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20 transition-all group active:scale-95"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Instagram className="w-5 h-5 text-[#bc2a24]" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-white/60 font-black uppercase tracking-widest leading-none mb-1">Desenvolvedor</p>
                  <p className="text-sm font-bold text-white">@im.machado.18</p>
                </div>
              </div>
              <MessageCircle className="w-5 h-5 text-white/40" />
            </a>

            <a 
              href="https://instagram.com/murill0_mariano" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20 transition-all group active:scale-95"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Instagram className="w-5 h-5 text-[#bc2a24]" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-white/60 font-black uppercase tracking-widest leading-none mb-1">Organização</p>
                  <p className="text-sm font-bold text-white">@murill0_mariano</p>
                </div>
              </div>
              <MessageCircle className="w-5 h-5 text-white/40" />
            </a>
          </div>

          <p className="mt-6 text-[11px] text-white/50 font-medium italic">
            Avisamos que podem mandar mensagem lá que tentamos responder e ajudar o mais rápido possível!
          </p>
        </div>
      </div>
    </motion.div>
  )
}
