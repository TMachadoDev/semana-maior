'use client'

import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { courses } from '@/lib/courses-data'
import { 
  ChevronLeft, 
  BookOpen, 
  GraduationCap, 
  Briefcase,
  LayoutGrid
} from 'lucide-react'

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const course = courses.find((c) => c.id === params.id)

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Curso não encontrado.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f1f0f0] pb-10">
      {/* Header with Background */}
      <div 
        className="h-[220px] relative flex flex-col justify-end p-6 overflow-hidden"
        style={{ backgroundColor: course.color }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        
        <button 
          onClick={() => router.back()}
          className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{course.emoji}</span>
            <div className="h-6 w-px bg-white/30" />
            <span className="text-white/80 text-xs font-bold uppercase tracking-widest">{course.area}</span>
          </div>
          <h1 className="text-3xl font-black text-white leading-tight font-display">
            {course.name}
          </h1>
        </motion.div>
      </div>

      {/* Info Cards */}
      <div className="px-5 -translate-y-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-2"
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
              style={{ backgroundColor: course.color + '15' }}
            >
              <LayoutGrid className="w-5 h-5" style={{ color: course.color }} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Turmas</p>
              <p className="text-lg font-black text-gray-900 leading-none mt-0.5">{course.classes}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-2"
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
              style={{ backgroundColor: course.color + '15' }}
            >
              <GraduationCap className="w-5 h-5" style={{ color: course.color }} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Duração</p>
              <p className="text-lg font-black text-gray-900 leading-none mt-0.5">{course.years} Anos</p>
            </div>
          </motion.div>
        </div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <h2 className="text-xs text-gray-400 font-bold uppercase tracking-widest">Sobre o curso</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {course.about}
          </p>

          <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: course.color + '10' }}
            >
              <Briefcase className="w-6 h-6" style={{ color: course.color }} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Foco Profissional</p>
              <p className="text-xs text-gray-600 font-medium leading-snug mt-0.5">
                Preparação para o mercado de trabalho e excelência técnica na área de {course.name.toLowerCase()}.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
