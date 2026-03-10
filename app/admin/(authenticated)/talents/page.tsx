'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Star, Music, X, Save } from 'lucide-react'

const initialTalents = [
  { id: '1', name: 'Banda Estrelada', type: 'Banda', performAt: '19:00', venue: 'Palco Principal', featured: true, day: 1 },
  { id: '2', name: 'Urban Flow', type: 'Dança', performAt: '14:30', venue: 'Palco Principal', featured: true, day: 1 },
  { id: '3', name: 'DJ Marcos', type: 'DJ Set', performAt: '21:30', venue: 'Palco Principal', featured: false, day: 1 },
  { id: '4', name: 'Coral da Escola', type: 'Coral', performAt: '18:00', venue: 'Auditório', featured: false, day: 2 },
]

export default function AdminTalentsPage() {
  const [talents, setTalents] = useState(initialTalents)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', type: '', performAt: '', venue: '', day: 1, featured: false })

  const handleDelete = (id: string) => setTalents(talents.filter(t => t.id !== id))
  const toggleFeatured = (id: string) => setTalents(talents.map(t => t.id === id ? { ...t, featured: !t.featured } : t))

  const handleSave = () => {
    setTalents([...talents, { id: Date.now().toString(), ...form }])
    setShowModal(false)
    setForm({ name: '', type: '', performAt: '', venue: '', day: 1, featured: false })
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
          className="flex items-center gap-2 px-4 py-2.5 bg-[#bc2a24] text-white rounded-xl text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Nova Atração
        </button>
      </div>

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
              <p className="text-xs text-gray-400">{talent.type} · Dia {talent.day} · {talent.performAt} · {talent.venue}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleFeatured(talent.id)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${talent.featured ? 'bg-[#fef2f2]' : 'bg-gray-50 hover:bg-gray-100'}`}
                title="Toggle destaque"
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

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-900">Nova Atração</h3>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X className="w-4 h-4 text-gray-500" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Nome</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none" placeholder="Banda, artista ou grupo" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Tipo</label>
                      <input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none" placeholder="Banda, DJ..." />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Dia</label>
                      <select value={form.day} onChange={e => setForm({ ...form, day: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none">
                        <option value={1}>Dia 1</option>
                        <option value={2}>Dia 2</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Horário</label>
                      <input type="time" value={form.performAt} onChange={e => setForm({ ...form, performAt: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Local</label>
                      <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none" placeholder="Palco Principal" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded accent-[#bc2a24]" />
                    <span className="text-sm text-gray-700">Marcar como destaque</span>
                  </label>
                  <button onClick={handleSave} className="w-full py-3.5 rounded-xl bg-[#bc2a24] text-white font-semibold text-sm flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" />
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
