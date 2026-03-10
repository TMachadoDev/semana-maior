'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Image as ImageIcon, X, Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'

interface GalleryImage {
  id: string
  url: string
  caption?: string
  featured: boolean
  uploadedAt: string
}

const colors = [
  '#bc2a24', '#1a1a2e', '#6366f1', '#059669',
  '#d97706', '#0ea5e9', '#374151', '#6b7280',
]

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch('/api/gallery')
        const data = await res.json()
        setImages(data)
      } catch (error) {
        console.error('Failed to fetch gallery:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Galeria" subtitle="Fotos do Evento" />

      <div className="px-5">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#bc2a24]" />
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center mb-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#f7f7f7] flex items-center justify-center mb-3">
              <Camera className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Fotos serão adicionadas em breve</p>
            <p className="text-xs text-gray-400 mt-1">Acompanhe as atualizações durante o evento</p>
          </div>
        ) : (
          <div className="columns-2 gap-2 space-y-2">
            {images.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={`break-inside-avoid rounded-2xl overflow-hidden relative cursor-pointer ${
                  photo.featured ? 'col-span-2' : ''
                }`}
                style={{ marginBottom: '8px' }}
                onClick={() => setSelectedImage(photo)}
              >
                {photo.url ? (
                  <img 
                    src={photo.url} 
                    alt={photo.caption || 'Foto da galeria'} 
                    className="w-full object-cover"
                    style={{ minHeight: photo.featured ? '200px' : '120px' }}
                  />
                ) : (
                  <div
                    className="w-full flex items-center justify-center"
                    style={{
                      height: photo.featured ? '120px' : '160px',
                      background: `linear-gradient(135deg, ${colors[i % colors.length]}30, ${colors[(i + 2) % colors.length]}20)`,
                      backgroundColor: '#f7f7f7',
                    }}
                  >
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  </div>
                )}

                {/* Caption overlay */}
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-[10px] font-medium truncate">{photo.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-300 mt-6 mb-4">
          Mais fotos serão adicionadas pelo admin durante o evento
        </p>
      </div>

      {/* Modal / Expanded Image */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedImage.url ? (
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.caption || 'Foto expandida'} 
                  className="w-full max-h-[80vh] object-contain rounded-2xl"
                />
              ) : (
                <div className="w-full h-[60vh] bg-gray-800 rounded-2xl flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-gray-600" />
                </div>
              )}
              {selectedImage.caption && (
                <p className="text-white text-center mt-4 font-medium text-sm">
                  {selectedImage.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
