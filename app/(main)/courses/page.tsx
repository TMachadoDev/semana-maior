'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { courses } from '@/lib/courses-data'
import { ChevronRight, GraduationCap, LayoutGrid, CheckCircle2, Trophy } from 'lucide-react'

export default function CoursesPage() {
  const [voted, setVoted] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const hasVoted = localStorage.getItem('course_voted')
    if (hasVoted) {
      setVoted(true)
      setSelectedCourse(hasVoted)
    }
  }, [])

  const handleVote = async (courseId: string) => {
    if (voted || isVoting) return
    
    setIsVoting(true)
    try {
      const res = await fetch('/api/courses/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })

      if (res.ok) {
        setVoted(true)
        setSelectedCourse(courseId)
        localStorage.setItem('course_voted', courseId)
        setMessage('Voto registado com sucesso!')
      } else {
        const data = await res.json()
        setMessage(data.error || 'Erro ao votar')
        if (data.error === 'Você já votou!') {
            setVoted(true)
            localStorage.setItem('course_voted', 'true')
        }
      }
    } catch (error) {
      setMessage('Erro de conexão')
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] pb-32">
      <PageHeader
        title="Nossos Cursos"
        subtitle="Conheça as áreas técnicas da nossa escola"
        showBack
      />

      <div className="px-5 pb-16 space-y-5 flex flex-col">
        {courses.map((course, index) => (
          <Link key={course.id} href={`/courses/${course.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-5 relative overflow-hidden group"
            >
              <div
                className="absolute right-0 top-0 w-32 h-full opacity-[0.03] transition-opacity group-hover:opacity-[0.05]"
                style={{ backgroundColor: course.color }}
              />

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-black/5 flex-shrink-0 z-10"
                style={{ backgroundColor: course.color + '15' }}
              >
                {course.emoji}
              </div>

              <div className="flex-1 min-w-0 z-10">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                  {course.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                  {course.description}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1">
                    <LayoutGrid className="w-3 h-3 text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      {course.classes} Turmas
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      {course.years} Anos
                    </span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 z-10" />
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Voting Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-5 p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-black/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#bc2a24]/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#bc2a24]/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#bc2a24]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 leading-tight">
                Já sabes que curso vais escolher?
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Diz-nos a tua preferência!
              </p>
            </div>
          </div>

          {!voted ? (
            <div className="grid grid-cols-1 gap-2 mt-6">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleVote(course.id)}
                  disabled={isVoting}
                  className="w-full p-4 rounded-2xl border border-gray-100 hover:border-[#bc2a24]/30 hover:bg-[#bc2a24]/5 transition-all flex items-center justify-between group text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{course.emoji}</span>
                    <span className="text-sm font-bold text-gray-700 group-hover:text-[#bc2a24] transition-colors">
                      {course.shortName}
                    </span>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-gray-100 group-hover:border-[#bc2a24]/50 flex items-center justify-center transition-all">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#bc2a24] scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 p-6 rounded-3xl bg-green-50 border border-green-100 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-green-900 font-black text-lg">Voto Registado!</h3>
              <p className="text-green-700 text-xs font-medium mt-1">
                Obrigado pela tua participação. Os resultados serão anunciados em breve.
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {message && !voted && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 text-center text-xs font-bold text-[#bc2a24]"
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
