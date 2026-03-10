'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { courses } from '@/lib/courses-data'
import { ChevronRight, GraduationCap, LayoutGrid } from 'lucide-react'

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-[#f1f0f0]">
      <PageHeader
        title="Nossos Cursos"
        subtitle="Conheça as áreas técnicas da nossa escola"
      />

      <div className="px-5 pb-10 space-y-4">
        {courses.map((course, index) => (
          <Link key={course.id} href={`/courses/${course.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden group mb-4"
            >
              {/* Accent background */}
              <div
                className="absolute right-0 top-0 w-32 h-full opacity-[0.03] transition-opacity group-hover:opacity-[0.05]"
                style={{ backgroundColor: course.color }}
              />

              {/* Emoji/Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-black/5 flex-shrink-0 z-10"
                style={{ backgroundColor: course.color + '15' }}
              >
                {course.emoji}
              </div>

              {/* Info */}
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
    </div>
  )
}
