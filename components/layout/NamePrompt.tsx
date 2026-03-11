'use client'

import { useState, useEffect } from 'react'

export function NamePrompt() {
  const [name, setName] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const storedName = localStorage.getItem('sm_user_name')
    if (!storedName) {
      setIsOpen(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) return

    localStorage.setItem('sm_user_name', name.trim())
    setIsOpen(false)
    // Disparar evento customizado para o Tracker saber que já pode enviar
    window.dispatchEvent(new Event('name_set'))
    window.location.reload() // Recarregar para garantir que tudo apanha o nome
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card border border-border p-8 rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-foreground mb-2">Bem-vindo à Semana Maior! 🚀</h2>
        <p className="text-muted-foreground mb-6">Como te chamas? Este nome será usado no chat e no ranking.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            required
            type="text"
            placeholder="O teu nome completo..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-secondary text-foreground px-4 py-3 rounded-xl border-2 border-transparent focus:border-primary outline-none transition-all text-lg"
          />
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20"
          >
            Começar Agora
          </button>
        </form>
      </div>
    </div>
  )
}
