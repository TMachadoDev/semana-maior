'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Star, Music, X, Save, Loader2, Calendar } from 'lucide-react'

interface Talent {
  id: string
  name: string
  type: string
  performAt?: string
  venue?: string
  featured: boolean
  description?: string
  schoolId?: string
  school?: { name: string }
}

const dayLabels: Record<number, string> = {
  1: '23 de Março',
  2: '24 de Março',
  3: '25 de Março',
  4: '26 de Março',
  5: '27 de Março',
}

const getEventDate = (day: number) => {
  const dates: Record<number, string> = {
    1: '2026-03-23',
    2: '2026-03-24',
    3: '2026-03-25',
    4: '2026-03-26',
    5: '2026-03-27'
  }
  return dates[day] || '2026-03-23'
}

export default function AdminTalentsPage() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ 
    name: '', 
    type: '', 
    performAt: '14:00', 
    venue: '', 
    description: '', 
    featured: false,
    day: 1,
    schoolId: ''
  })

  useEffect(() => {
    Promise.all([fetchTalents(), fetchSchools()]).finally(() => setLoading(false))
  }, [])

  const fetchSchools = async () => {
    try {
      const res = await fetch('/api/schools')
      const data = await res.json()
      setSchools(data)
    } catch (error) {
      console.error('Error fetching schools:', error)
    }
  }

  const fetchTalents = async () => {
    try {
      const res = await fetch('/api/talents')
      const data = await res.json()
      setTalents(data)
    } catch (error) {
      console.error('Failed to fetch talents:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return
    try {
      const res = await fetch(`/api/talents?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setTalents(talents.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Error deleting talent:', error)
    }
  }

  const toggleFeatured = async (id: string) => {
    // This would need a PUT endpoint in the API
    setTalents(talents.map(t => t.id === id ? { ...t, featured: !t.featured } : t))
  }

  const handleSave = async () => {
    if (!form.name) return
    setIsSubmitting(true)
    try {
      const eventDate = getEventDate(form.day)
      const performAtDate = form.performAt ? new Date(`${eventDate}T${form.performAt}:00`) : null

      const res = await fetch('/api/talents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          performAt: performAtDate
        }),
      })
      
      if (res.ok) {
        const newTalent = await res.json()
        setTalents([...talents, newTalent])
        setShowModal(false)
        setForm({ 
          name: '', 
          type: '', 
          performAt: '14:00', 
          venue: '', 
          description: '', 
          featured: false, 
          day: 1, 
          schoolId: schools.length > 0 ? schools[0].id : '' 
        })
      }
    } catch (error) {
      console.error('Error creating talent:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Talentos</h1>
          <p className="text-sm text-gray-400 mt-0.5">{talents.length} atrações cadastradas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#bc2a24] text-white rounded-xl text-sm font-semibold hover:bg-[#a02420] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Atração
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-[#bc2a24]" />
        </div>
      ) : (
        <div className="space-y-3">
          {talents.map(talent => (
            <motion.div
              key={talent.id}
              layout
              className="bg-white rounded-2xl border border-gray-100 px-4 py-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#fef2f2] flex items-center justify-center">
                <Music className="w-5 h-5 text-[#bc2a24]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-gray-900">{talent.name}</p>
                  {talent.featured && <Star className="w-3.5 h-3.5 fill-[#bc2a24] text-[#bc2a24]" />}
                </div>
                <p className="text-xs text-gray-400">
                  {talent.type} 
                  {talent.performAt && ` · ${new Date(talent.performAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })} ${new Date(talent.performAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`} 
                  {talent.venue && ` · ${talent.venue}`}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleFeatured(talent.id)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${talent.featured ? 'bg-[#fef2f2]' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <Star className={`w-3.5 h-3.5 ${talent.featured ? 'fill-[#bc2a24] text-[#bc2a24]' : 'text-gray-400'}`} />
                </button>
                <button
                  onClick={() => handleDelete(talent.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && talents.length === 0 && (
        <div className="text-center py-16 text-gray-300">
          <Music className="w-12 h-12 mx-auto mb-3" />
          <p className="text-sm">Nenhuma atração cadastrada</p>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-900">Nova Atração</h3>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X className="w-4 h-4 text-gray-500" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Nome</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none border-2 border-transparent focus:border-[#bc2a24]/10 transition-all" placeholder="Banda, artista ou grupo" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Escola</label>
                    <select
                      value={form.schoolId}
                      onChange={e => setForm({ ...form, schoolId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none border-2 border-transparent focus:border-[#bc2a24]/10 transition-all"
                    >
                      <option value="">Selecione uma escola</option>
                      {schools.map(school => (
                        <option key={school.id} value={school.id}>{school.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Tipo</label>
                    <input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none border-2 border-transparent focus:border-[#bc2a24]/10 transition-all" placeholder="Banda, DJ, Dança..." />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Dia</label>
                      <select 
                        value={form.day} 
                        onChange={e => setForm({ ...form, day: Number(e.target.value) })} 
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none border-2 border-transparent focus:border-[#bc2a24]/10 transition-all"
                      >
                        {[1, 2, 3, 4, 5].map(d => (
                          <option key={d} value={d}>Dia {d} ({dayLabels[d]})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Horário</label>
                      <input type="time" value={form.performAt} onChange={e => setForm({ ...form, performAt: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none border-2 border-transparent focus:border-[#bc2a24]/10 transition-all" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Local</label>
                    <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none border-2 border-transparent focus:border-[#bc2a24]/10 transition-all" placeholder="Palco Principal" />
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded accent-[#bc2a24] w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">Marcar como destaque</span>
                  </label>
                  
                  <button 
                    onClick={handleSave} 
                    disabled={isSubmitting || !form.name}
                    className="w-full py-4 rounded-xl bg-[#bc2a24] text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#bc2a24]/20 active:scale-95 transition-all mt-4"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Criar Atração
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
