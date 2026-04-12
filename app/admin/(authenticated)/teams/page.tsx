'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react'

interface Team {
  id: string
  name: string
  color: string
  points: number
  wins: number
  losses: number
  draws: number
  groupId: string | null
  schoolId: string | null
  tournamentId: string | null
  group?: { id: string, name: string }
  school?: { id: string, name: string }
  tournament?: { id: string, name: string, mode: string }
}

interface Group {
  id: string
  name: string
}

interface Tournament {
  id: string
  name: string
  mode: string
}

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [schools, setSchools] = useState<any[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ 
    name: '', 
    color: '#bc2a24', 
    groupId: '',
    schoolId: '',
    tournamentId: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [teamsRes, groupsRes, schoolsRes, tournamentsRes] = await Promise.all([
        fetch('/api/teams'),
        fetch('/api/teams?type=groups'),
        fetch('/api/schools'),
        fetch('/api/teams?type=tournaments')
      ])
      const teamsData = await teamsRes.json()
      const groupsData = await groupsRes.json()
      const schoolsData = await schoolsRes.json()
      const tournamentsData = await tournamentsRes.json()
      setTeams(teamsData)
      setGroups(groupsData)
      setSchools(schoolsData)
      setTournaments(tournamentsData)
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este time?')) return
    try {
      const res = await fetch(`/api/teams?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setTeams(teams.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete team', error)
    }
  }

  const handleEdit = (team: Team) => {
    setIsEditing(true)
    setEditingId(team.id)
    setForm({
      name: team.name,
      color: team.color,
      groupId: team.groupId || '',
      schoolId: team.schoolId || (schools.length > 0 ? schools[0].id : ''),
      tournamentId: team.tournamentId || '',
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const method = isEditing ? 'PUT' : 'POST'
      
      const isVolley = tournaments.find(t => t.id === form.tournamentId)?.mode === 'VOLLEY'
      
      const payload = {
        ...form,
        groupId: isVolley ? null : (form.groupId || null), // Nullify group if Volley
      }

      const body = isEditing ? { id: editingId, ...payload } : payload
      const res = await fetch('/api/teams', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (res.ok) {
        await fetchData()
        setShowModal(false)
        resetForm()
      } else {
        const errData = await res.json()
        alert(`Erro ao salvar: ${errData.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Failed to save team', error)
      alert('Erro ao conectar com o servidor')
    } finally {
      setIsSaving(false)
    }
  }

  const resetForm = () => {
    setForm({ 
      name: '', 
      color: '#bc2a24', 
      groupId: '',
      schoolId: schools.length > 0 ? schools[0].id : '',
      tournamentId: '',
    })
    setIsEditing(false)
    setEditingId(null)
  }

  const openNewModal = () => {
    resetForm()
    setShowModal(true)
  }

  if (loading && teams.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Times</h1>
          <p className="text-sm text-gray-400 mt-0.5">{teams.length} times cadastrados</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#bc2a24] text-white rounded-xl text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Novo Time
        </button>
      </div>

      {groups.map(group => {
        const groupTeams = teams.filter(t => t.groupId === group.id)
        if (groupTeams.length === 0) return null
        
        return (
          <div key={group.id} className="mb-6">
            <h2 className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">{group.name}</h2>
            <div className="space-y-2">
              {groupTeams.map(team => (
                <motion.div
                  key={team.id}
                  layout
                  className="bg-white rounded-2xl border border-gray-100 px-4 py-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: team.color }}>
                    {team.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">{team.name}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{team.wins}</div>
                      <div className="text-[10px] text-gray-400">V</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{team.losses}</div>
                      <div className="text-[10px] text-gray-400">D</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-[#bc2a24]">{team.points}</div>
                      <div className="text-[10px] text-gray-400">PTS</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(team)}
                      className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center"
                    >
                      <Pencil className="w-3.5 h-3.5 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(team.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Teams without group */}
      {teams.filter(t => !t.groupId).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">Sem Grupo / Volley</h2>
          <div className="space-y-2">
            {teams.filter(t => !t.groupId).map(team => (
              <motion.div
                key={team.id}
                layout
                className="bg-white rounded-2xl border border-gray-100 px-4 py-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: team.color }}>
                  {team.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">{team.name}</p>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                   {team.tournament?.name || 'Sem Torneio'}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(team)}
                    className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center"
                  >
                    <Pencil className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              onClick={() => !isSaving && setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh] pointer-events-auto">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-900">{isEditing ? 'Editar Time' : 'Novo Time'}</h3>
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
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Nome do Time</label>
                    <input
                      disabled={isSaving}
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                      placeholder="Ex: Informática FC"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Escola</label>
                      <select
                        disabled={isSaving}
                        value={form.schoolId}
                        onChange={e => setForm({ ...form, schoolId: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                      >
                        {schools.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Torneio</label>
                      <select
                        disabled={isSaving}
                        value={form.tournamentId}
                        onChange={e => setForm({ ...form, tournamentId: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                      >
                        <option value="">Nenhum</option>
                        {tournaments.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {tournaments.find(t => t.id === form.tournamentId)?.mode !== 'VOLLEY' && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Grupo (Futsal)</label>
                        <select
                          disabled={isSaving}
                          value={form.groupId}
                          onChange={e => setForm({ ...form, groupId: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                        >
                          <option value="">Nenhum</option>
                          {groups.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Cor</label>
                      <input
                        disabled={isSaving}
                        type="color"
                        value={form.color}
                        onChange={e => setForm({ ...form, color: e.target.value })}
                        className="w-full h-10 rounded-xl bg-[#f7f7f7] cursor-pointer border-0 outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-xl">
                    <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
                      ℹ️ As estatísticas (vitórias, derrotas e pontos) são calculadas automaticamente com base nos resultados das partidas encerradas.
                    </p>
                  </div>

                  <button
                    disabled={isSaving}
                    onClick={handleSave}
                    className="w-full py-3.5 rounded-xl bg-[#bc2a24] text-white font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {isEditing ? 'Salvar Alterações' : 'Criar Time'}
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
