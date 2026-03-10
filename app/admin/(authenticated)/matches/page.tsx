'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Clock, Zap, Save, Plus, Trash2, X, Loader2 } from 'lucide-react'

interface Team {
  id: string
  name: string
}

interface Tournament {
  id: string
  name: string
}

interface Match {
  id: string
  homeTeamId: string
  awayTeamId: string
  homeTeam: Team
  awayTeam: Team
  homeScore: number | null
  awayScore: number | null
  status: string
  scheduledAt: string
  venue: string | null
  stage: string
  tournamentId: string
  tournament: Tournament
}

const statusConfig: any = {
  FINISHED: { label: 'Encerrado', icon: CheckCircle, color: '#059669', bg: '#dcfce7' },
  LIVE: { label: 'Ao Vivo', icon: Zap, color: '#bc2a24', bg: '#fef2f2' },
  SCHEDULED: { label: 'Agendado', icon: Clock, color: '#6b7280', bg: '#f3f4f6' },
  CANCELLED: { label: 'Cancelado', icon: X, color: '#ef4444', bg: '#fee2e2' },
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    tournamentId: '',
    homeTeamId: '',
    awayTeamId: '',
    scheduledAt: '',
    venue: '',
    stage: 'group',
    homeScore: '',
    awayScore: '',
    status: 'SCHEDULED'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [matchesRes, teamsRes, tournamentsRes] = await Promise.all([
        fetch('/api/matches'),
        fetch('/api/teams'),
        fetch('/api/matches?type=tournaments')
      ])
      const matchesData = await matchesRes.json()
      const teamsData = await teamsRes.json()
      const tournamentsData = await tournamentsRes.json()
      
      setMatches(matchesData)
      setTeams(teamsData)
      setTournaments(tournamentsData)
      
      if (tournamentsData.length > 0 && !form.tournamentId) {
        setForm(prev => ({ ...prev, tournamentId: tournamentsData[0].id }))
      }
      if (teamsData.length >= 2 && !form.homeTeamId) {
        setForm(prev => ({ ...prev, homeTeamId: teamsData[0].id, awayTeamId: teamsData[1].id }))
      }
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta partida?')) return
    try {
      const res = await fetch(`/api/matches?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMatches(matches.filter(m => m.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete match', error)
    }
  }

  const handleEdit = (match: Match) => {
    setIsEditing(true)
    setEditingId(match.id)
    setForm({
      tournamentId: match.tournamentId,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      scheduledAt: new Date(match.scheduledAt).toISOString().slice(0, 16),
      venue: match.venue || '',
      stage: match.stage,
      homeScore: match.homeScore?.toString() ?? '',
      awayScore: match.awayScore?.toString() ?? '',
      status: match.status
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      const method = isEditing ? 'PUT' : 'POST'
      const body = {
        ...(isEditing ? { id: editingId } : {}),
        ...form,
        homeScore: form.homeScore !== '' ? parseInt(form.homeScore) : null,
        awayScore: form.awayScore !== '' ? parseInt(form.awayScore) : null,
      }
      
      const res = await fetch('/api/matches', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (res.ok) {
        fetchData()
        setShowModal(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save match', error)
    }
  }

  const resetForm = () => {
    setForm({
      tournamentId: tournaments.length > 0 ? tournaments[0].id : '',
      homeTeamId: teams.length > 0 ? teams[0].id : '',
      awayTeamId: teams.length > 1 ? teams[1].id : '',
      scheduledAt: '',
      venue: '',
      stage: 'group',
      homeScore: '',
      awayScore: '',
      status: 'SCHEDULED'
    })
    setIsEditing(false)
    setEditingId(null)
  }

  const openNewModal = () => {
    resetForm()
    setShowModal(true)
  }

  if (loading && matches.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#bc2a24]" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partidas</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gerencie resultados e status dos jogos</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#bc2a24] text-white rounded-xl text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Nova Partida
        </button>
      </div>

      <div className="space-y-3">
        {matches.map((match) => {
          const statusInfo = statusConfig[match.status] || statusConfig.SCHEDULED

          return (
            <motion.div
              key={match.id}
              layout
              className="bg-white rounded-2xl border border-gray-100 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                >
                  <statusInfo.icon className="w-3 h-3" />
                  {statusInfo.label}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(match.scheduledAt).toLocaleString('pt-BR', { 
                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                  })} · {match.venue || 'Local não definido'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm text-gray-900 flex-1">{match.homeTeam.name}</p>
                <div className="px-4 text-center">
                  {match.homeScore !== null ? (
                    <span className="text-xl font-black text-gray-900">
                      {match.homeScore} × {match.awayScore}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-300 font-medium">— × —</span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <p className="font-semibold text-sm text-gray-900 text-right">{match.awayTeam.name}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(match)}
                  className="px-3 py-1.5 text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(match.id)}
                  className="px-3 py-1.5 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-900">{isEditing ? 'Editar Partida' : 'Nova Partida'}</h3>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Torneio</label>
                    <select
                      value={form.tournamentId}
                      onChange={e => setForm({ ...form, tournamentId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                    >
                      {tournaments.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Time Casa</label>
                      <select
                        value={form.homeTeamId}
                        onChange={e => setForm({ ...form, homeTeamId: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                      >
                        {teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Time Fora</label>
                      <select
                        value={form.awayTeamId}
                        onChange={e => setForm({ ...form, awayTeamId: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                      >
                        {teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Placar Casa</label>
                      <input
                        type="number"
                        value={form.homeScore}
                        onChange={e => setForm({ ...form, homeScore: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Placar Fora</label>
                      <input
                        type="number"
                        value={form.awayScore}
                        onChange={e => setForm({ ...form, awayScore: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Status</label>
                    <select
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                    >
                      <option value="SCHEDULED">Agendado</option>
                      <option value="LIVE">Ao Vivo</option>
                      <option value="FINISHED">Encerrado</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Data e Hora</label>
                    <input
                      type="datetime-local"
                      value={form.scheduledAt}
                      onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Local</label>
                    <input
                      value={form.venue}
                      onChange={e => setForm({ ...form, venue: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                      placeholder="Ex: Quadra Principal"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Fase</label>
                    <input
                      value={form.stage}
                      onChange={e => setForm({ ...form, stage: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                      placeholder="Ex: group, semifinal, final"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-full py-3.5 rounded-xl bg-[#bc2a24] text-white font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isEditing ? 'Salvar Alterações' : 'Criar Partida'}
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
