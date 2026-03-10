'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Trash2, Star, Plus, Image, Link } from 'lucide-react'

const initialImages = [
  { id: '1', url: '', caption: 'Abertura', featured: true },
  { id: '2', url: '', caption: 'Futsal', featured: false },
]

export default function AdminGalleryPage() {
  const [images, setImages] = useState(initialImages)
  const [urlInput, setUrlInput] = useState('')
  const [captionInput, setCaptionInput] = useState('')

  const handleAdd = () => {
    if (!urlInput) return
    setImages([...images, {
      id: Date.now().toString(),
      url: urlInput,
      caption: captionInput,
      featured: false,
    }])
    setUrlInput('')
    setCaptionInput('')
  }

  const handleDelete = (id: string) => setImages(images.filter(i => i.id !== id))
  const toggleFeatured = (id: string) => setImages(images.map(i => i.id === id ? { ...i, featured: !i.featured } : i))

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Galeria</h1>
        <p className="text-sm text-gray-400 mt-0.5">Adicione fotos do evento</p>
      </div>

      {/* Add photo form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Adicionar Foto</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">URL da Imagem</label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">Legenda</label>
            <input
              value={captionInput}
              onChange={e => setCaptionInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#f7f7f7] text-sm outline-none"
              placeholder="Descrição da foto"
            />
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#bc2a24] text-white rounded-xl text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Adicionar Foto
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map(img => (
          <motion.div
            key={img.id}
            layout
            className="relative rounded-2xl overflow-hidden bg-[#f7f7f7] aspect-square group"
          >
            {img.url ? (
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image className="w-10 h-10 text-gray-300" />
              </div>
            )}
            
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/50 to-transparent">
                <p className="text-white text-[10px] font-medium truncate">{img.caption}</p>
              </div>
            )}

            <div className="absolute top-2 right-2 flex gap-1">
              <button
                onClick={() => toggleFeatured(img.id)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center backdrop-blur-sm ${img.featured ? 'bg-[#bc2a24]' : 'bg-black/30'}`}
              >
                <Star className={`w-3.5 h-3.5 ${img.featured ? 'fill-white text-white' : 'text-white/70'}`} />
              </button>
              <button
                onClick={() => handleDelete(img.id)}
                className="w-7 h-7 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center"
              >
                <Trash2 className="w-3.5 h-3.5 text-white/70" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-16 text-gray-300">
          <Image className="w-12 h-12 mx-auto mb-3" />
          <p className="text-sm">Nenhuma foto adicionada</p>
        </div>
      )}
    </div>
  )
}
