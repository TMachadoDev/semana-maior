'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Clock, MapPin, X, Save, Loader2 } from 'lucide-react'

const typeColors: Record<string, string> = {
  TOURNAMENT: '#bc2a24',
  CONCERT: '#6366f1',
  SHOWCASE: '#d97706',
  CEREMONY: '#0ea5e9',
  OTHER: '#6b7280',
}

const typeLabels: Record<string, string> = {
  TOURNAMENT: 'Torneio',
  CONCERT: 'Show',
  SHOWCASE: 'Apresentação',
  CEREMONY: 'Cerimônia',
  OTHER: 'Outro',
}

export default function AdminSchedulePage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  
  const [form, setForm] = useState({ 
    title: '', 
    type: 'OTHER', 
    startTime: '', 
    venue: '', 
    day: 1 
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/schedule')
      const data = await res.json()
      // Transform ISO dates to HH:mm for the UI
      const formatted = data.map((e: any) => ({
        ...e,
        startTime: new Date(e.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }))
      setEvents(formatted)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditingEvent(null)
    setForm({ title: '', type: 'OTHER', startTime: '09:00', venue: '', day: 1 })
    setShowModal(true)
  }

  const openEdit = (event: any) => {
    setEditingEvent(event)
    setForm({ 
      title: event.title, 
      type: event.type, 
      startTime: event.startTime, 
      venue: event.venue || '', 
      day: event.day 
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const method = editingEvent ? 'PUT' : 'POST'
      const body = editingEvent ? { id: editingEvent.id, ...form } : form
      
      const res = await fetch('/api/schedule', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        await fetchEvents()
        setShowModal(false)
      }
    } catch (error) {
      console.error('Error saving event:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return

    try {
      const res = await fetch(`/api/schedule?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setEvents(events.filter(e => e.id !== id))
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#bc2a24]" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programação</h1>
          <p className="text-sm text-gray-400 mt-0.5">{events.length} eventos no total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#bc2a24] text-white rounded-xl text-sm font-semibold hover:bg-[#a02420] transition-colors shadow-lg shadow-[#bc2a24]/20"
        >
          <Plus className="w-4 h-4" />
          Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {[1, 2].map(day => (
          <div key={day}>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-bold text-gray-900">Dia {day}</h2>
              <span className="text-xs text-gray-400 font-normal">
                {day === 1 ? '26 de Março' : '27 de Março'}
              </span>
            </div>
            
            <div className="space-y-3">
              {events.filter(e => e.day === day).length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400">Nenhum evento</p>
                </div>
              )}
              {events.filter(e => e.day === day).map(event => (
                <motion.div
                  key={event.id}
                  layout
                  className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: typeColors[event.type] || '#6b7280' }}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {typeLabels[event.type] || event.type}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-gray-900 leading-tight">{event.title}</p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {event.startTime}
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {event.venue || '—'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => openEdit(event)}
                        className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-[#bc2a24]"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-red-50 flex items-center justify-center transition-colors text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => !saving && setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">{editingEvent ? 'Editar Evento' : 'Novo Evento'}</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Título do Evento</label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#f7f7f7] text-sm text-gray-900 outline-none border-2 border-transparent focus:border-[#bc2a24]/10 focus:bg-white transition-all"
                    placeholder="Ex: Cerimônia de Abertura"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Tipo</label>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#f7f7f7] text-sm text-gray-900 outline-none border-2 border-transparent focus:border-[#bc2a24]/10 focus:bg-white transition-all appearance-none"
                    >
                      <option value="TOURNAMENT">Torneio</option>
                      <option value="CONCERT">Show</option>
                      <option value="SHOWCASE">Apresentação</option>
                      <option value="CEREMONY">Cerimônia</option>
                      <option value="OTHER">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Dia</label>
                    <select
                      value={form.day}
                      onChange={e => setForm({ ...form, day: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-[#f7f7f7] text-sm text-gray-900 outline-none border-2 border-transparent focus:border-[#bc2a24]/10 focus:bg-white transition-all appearance-none"
                    >
                      <option value={1}>Dia 1 — 26 Mar</option>
                      <option value={2}>Dia 2 — 27 Mar</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Horário</label>
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={e => setForm({ ...form, startTime: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#f7f7f7] text-sm text-gray-900 outline-none border-2 border-transparent focus:border-[#bc2a24]/10 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Local</label>
                    <input
                      value={form.venue}
                      onChange={e => setForm({ ...form, venue: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#f7f7f7] text-sm text-gray-900 outline-none border-2 border-transparent focus:border-[#bc2a24]/10 focus:bg-white transition-all"
                      placeholder="Auditório"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving || !form.title || !form.startTime}
                  className="w-full py-4 rounded-xl bg-[#bc2a24] text-white font-bold text-sm flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#bc2a24]/20 disabled:opacity-50 active:scale-95 transition-all"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingEvent ? 'Salvar Alterações' : 'Criar Evento'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
