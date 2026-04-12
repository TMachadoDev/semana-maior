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
    <div className="min-h-screen bg-[#f8f8f8] pb-24">
      {/* Header with Background */}
      <div 
        className="h-[280px] relative flex flex-col justify-end p-8 overflow-hidden"
        style={{ backgroundColor: course.color }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        
        <button 
          onClick={() => router.back()}
          className="absolute top-12 left-6 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white z-10 hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{course.emoji}</span>
            <div className="h-6 w-px bg-white/30" />
            <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">{course.area}</span>
          </div>
          <h1 className="text-3xl font-black text-white leading-tight font-display pr-4">
            {course.name}
          </h1>
        </motion.div>
      </div>

      {/* Info Cards */}
      <div className="px-6 -translate-y-2 space-y-8 mt-12">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2rem] p-6 shadow-xl shadow-black/[0.03] border border-gray-100 flex flex-col gap-3"
          >
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
              style={{ backgroundColor: course.color + '15' }}
            >
              <LayoutGrid className="w-6 h-6" style={{ color: course.color }} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Turmas</p>
              <p className="text-2xl font-black text-gray-900 leading-none mt-1">{course.classes}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2rem] p-6 shadow-xl shadow-black/[0.03] border border-gray-100 flex flex-col gap-3"
          >
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
              style={{ backgroundColor: course.color + '15' }}
            >
              <GraduationCap className="w-6 h-6" style={{ color: course.color }} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Duração</p>
              <p className="text-2xl font-black text-gray-900 leading-none mt-1">{course.years} Anos</p>
            </div>
          </motion.div>
        </div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.03] border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-4 h-4 text-[#bc2a24]" />
            <h2 className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Sobre o curso</h2>
          </div>
          <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
            {course.about}
          </p>

          <div className="mt-10 pt-8 border-t border-gray-50 flex items-center gap-5">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"
              style={{ backgroundColor: course.color + '08' }}
            >
              <Briefcase className="w-7 h-7" style={{ color: course.color }} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Foco Profissional</p>
              <p className="text-[13px] text-gray-600 font-semibold leading-snug mt-1.5">
                Preparação para o mercado de trabalho e excelência técnica na área de {course.shortName}.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
