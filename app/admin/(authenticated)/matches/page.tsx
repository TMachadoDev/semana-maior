'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Clock, Zap, Save, Plus, Trash2, X, Loader2, Sparkles } from 'lucide-react'
import { PHASE_OPTIONS, getPhaseLabel } from '@/utils/tournament'

interface Team {
  id: string
  name: string
}

interface Tournament {
  id: string
  name: string
  mode: string
}

interface Match {
  id: string
  teamAId: string
  teamBId: string
  teamA: Team
  teamB: Team
  teamAScore: number | null
  teamBScore: number | null
  status: string
  scheduledAt: string | null
  location: string | null
  phase: string
  leg: number | null
  winnerTeamId: string | null
  tournamentId: string
  tournament: Tournament
}

const statusConfig: any = {
  FINISHED: { label: 'Encerrado', icon: CheckCircle, color: '#059669', bg: '#dcfce7' },
  LIVE: { label: 'Ao Vivo', icon: Zap, color: '#bc2a24', bg: '#fef2f2' },
  SCHEDULED: { label: 'Agendado', icon: Clock, color: '#6b7280', bg: '#f3f4f6' },
  WALKOVER: { label: 'W.O.', icon: CheckCircle, color: '#d97706', bg: '#fef3c7' },
  CANCELLED: { label: 'Cancelado', icon: X, color: '#ef4444', bg: '#fee2e2' },
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const [form, setForm] = useState({
    tournamentId: '',
    teamAId: '',
    teamBId: '',
    scheduledAt: '',
    location: '',
    phase: 'INITIAL_STAGE',
    leg: '',
    teamAScore: '',
    teamBScore: '',
    winnerTeamId: '',
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
      if (teamsData.length >= 2 && !form.teamAId) {
        setForm(prev => ({ ...prev, teamAId: teamsData[0].id, teamBId: teamsData[1].id }))
      }
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAutoGenerate = async () => {
    const futsalTournaments = tournaments.filter(t => t.mode === 'FUTSAL')
    if (futsalTournaments.length === 0) return alert('Não há torneios de Futsal disponíveis.')
    
    let tId = futsalTournaments[0].id
    if (futsalTournaments.length > 1) {
       const choice = prompt(`Digite o ID do torneio ou o nome:\n${futsalTournaments.map(t => `${t.name} (ID: ${t.id})`).join('\n')}`)
       if (!choice) return
       const found = futsalTournaments.find(t => t.id === choice || t.name === choice)
       if (!found) return alert('Torneio não encontrado.')
       tId = found.id
    }

    if (!confirm('Deseja gerar automaticamente os cruzamentos entre Grupo A e Grupo B? (O local será Pavilhão ESSMM)')) return

    setIsGenerating(true)
    try {
      const res = await fetch('/api/admin/tournaments/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId: tId })
      })
      const data = await res.json()
      if (res.ok) {
        alert(`Sucesso! Foram geradas ${data.count} partidas.`)
        fetchData()
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error) {
      alert('Erro ao gerar partidas.')
    } finally {
      setIsGenerating(false)
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
      teamAId: match.teamAId,
      teamBId: match.teamBId,
      scheduledAt: match.scheduledAt ? new Date(match.scheduledAt).toISOString().slice(0, 16) : '',
      location: match.location || '',
      phase: match.phase,
      leg: match.leg?.toString() ?? '',
      teamAScore: match.teamAScore?.toString() ?? '',
      teamBScore: match.teamBScore?.toString() ?? '',
      winnerTeamId: match.winnerTeamId || '',
      status: match.status
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const method = isEditing ? 'PUT' : 'POST'
      const body = {
        ...(isEditing ? { id: editingId } : {}),
        ...form,
        teamAScore: form.teamAScore !== '' ? parseInt(form.teamAScore) : null,
        teamBScore: form.teamBScore !== '' ? parseInt(form.teamBScore) : null,
        leg: form.leg !== '' ? parseInt(form.leg) : null,
        winnerTeamId: form.winnerTeamId !== '' ? form.winnerTeamId : null,
      }
      
      const res = await fetch('/api/matches', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (res.ok) {
        await fetchData()
        setShowModal(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save match', error)
    } finally {
      setIsSaving(false)
    }
  }

  const resetForm = () => {
    setForm({
      tournamentId: tournaments.length > 0 ? tournaments[0].id : '',
      teamAId: teams.length > 0 ? teams[0].id : '',
      teamBId: teams.length > 1 ? teams[1].id : '',
      scheduledAt: '',
      location: '',
      phase: 'INITIAL_STAGE',
      leg: '',
      teamAScore: '',
      teamBScore: '',
      winnerTeamId: '',
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
        <div className="flex items-center gap-2">
            <button
                onClick={handleAutoGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-100 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
                <Sparkles className="w-4 h-4 text-[#bc2a24]" />
                {isGenerating ? 'A gerar...' : 'Cruzamento A/B'}
            </button>
            <button
                onClick={openNewModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#bc2a24] text-white rounded-xl text-sm font-semibold"
            >
                <Plus className="w-4 h-4" />
                Nova Partida
            </button>
        </div>
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
                  {match.scheduledAt ? new Date(match.scheduledAt).toLocaleString('pt-BR', { 
                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                  }) : 'Sem data'} · {match.location || 'Local não definido'} · {getPhaseLabel(match.phase)} {match.leg ? `(Mão ${match.leg})` : ''}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm text-gray-900 flex-1">{match.teamA?.name}</p>
                <div className="px-4 text-center">
                  {match.tournament?.mode === 'VOLLEY' ? (
                     <span className="text-sm text-gray-900 font-bold px-3 py-1 bg-gray-50 rounded-lg">
                       {match.winnerTeamId ? (match.winnerTeamId === match.teamAId ? `Vitória ${match.teamA?.name}` : `Vitória ${match.teamB?.name}`) : '— vs —'}
                     </span>
                  ) : (
                    match.teamAScore !== null ? (
                      <span className="text-xl font-black text-gray-900">
                        {match.teamAScore} × {match.teamBScore}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-300 font-medium">— × —</span>
                    )
                  )}
                </div>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <p className="font-semibold text-sm text-gray-900 text-right">{match.teamB?.name}</p>
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
              onClick={() => !isSaving && setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh] pointer-events-auto">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-900">{isEditing ? 'Editar Partida' : 'Nova Partida'}</h3>
                  <button 
                    disabled={isSaving}
                    onClick={() => setShowModal(false)} 
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Torneio</label>
                    <select
                      disabled={isSaving}
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
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Equipa A</label>
                      <select
                        disabled={isSaving}
                        value={form.teamAId}
                        onChange={e => setForm({ ...form, teamAId: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                      >
                        {teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Equipa B</label>
                      <select
                        disabled={isSaving}
                        value={form.teamBId}
                        onChange={e => setForm({ ...form, teamBId: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                      >
                        {teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {tournaments.find(t => t.id === form.tournamentId)?.mode === 'VOLLEY' ? (
                     <div>
                       <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Vencedor</label>
                       <select
                         disabled={isSaving}
                         value={form.winnerTeamId}
                         onChange={e => setForm({ ...form, winnerTeamId: e.target.value })}
                         className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                       >
                         <option value="">Ainda não definido</option>
                         <option value={form.teamAId}>Equipa A</option>
                         <option value={form.teamBId}>Equipa B</option>
                       </select>
                     </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Placar A</label>
                        <input
                          disabled={isSaving}
                          type="number"
                          value={form.teamAScore}
                          onChange={e => setForm({ ...form, teamAScore: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Placar B</label>
                        <input
                          disabled={isSaving}
                          type="number"
                          value={form.teamBScore}
                          onChange={e => setForm({ ...form, teamBScore: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Data e Hora (Opcional)</label>
                    <input
                      disabled={isSaving}
                      type="datetime-local"
                      value={form.scheduledAt}
                      onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Local</label>
                    <input
                      disabled={isSaving}
                      value={form.location}
                      onChange={e => setForm({ ...form, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                      placeholder="Ex: Quadra Principal"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Fase</label>
                      <select
                        disabled={isSaving}
                        value={form.phase}
                        onChange={e => setForm({ ...form, phase: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                      >
                        {PHASE_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Mão (Leg)</label>
                      <input
                        disabled={isSaving}
                        type="number"
                        value={form.leg}
                        onChange={e => setForm({ ...form, leg: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                        placeholder="Ex: 1 ou 2"
                      />
                    </div>
                  </div>

                  <button
                    disabled={isSaving}
                    onClick={handleSave}
                    className="w-full py-3.5 rounded-xl bg-[#bc2a24] text-white font-semibold text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {isEditing ? 'Salvar Alterações' : 'Criar Partida'}
                      </>
                    )}
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
