'use client'

import { useEffect, useState, useRef } from 'react'
import * as Ably from 'ably'
import { Send, User, Circle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  name: string
  text: string
  timestamp: number
}

export function GlobalChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [userName, setUserName] = useState('')
  const ablyRef = useRef<Ably.Realtime | null>(null)
  const channelRef = useRef<Ably.RealtimeChannel | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const name = localStorage.getItem('sm_user_name') || 'Anónimo'
    setUserName(name)

    const ably = new Ably.Realtime({ key: 'MJzqBA.e9ChAg:7HYGpPaWV-EeyscZi75DJXcJP6WkCYkmmKcHVYAvslQ' }) 
    ablyRef.current = ably
    const channel = ably.channels.get('global-chat')
    channelRef.current = channel

    channel.subscribe('message', (msg) => {
      setMessages((prev) => [...prev, msg.data])
    })

    return () => {
      channel.unsubscribe()
      ably.close()
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !channelRef.current) return

    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      name: userName,
      text: input,
      timestamp: Date.now()
    }

    channelRef.current.publish('message', newMessage)
    setInput('')
  }

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(' ')
    if (names.length === 0) return '?'
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase()
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
              <User className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Comunidade SM</h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Online agora</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Tu</p>
          <p className="text-xs font-bold text-gray-900 truncate max-w-[100px]">{userName}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#fcfcfc]">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isMe = msg.name === userName
            const prevMsg = messages[idx - 1]
            const showName = !prevMsg || prevMsg.name !== msg.name

            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
              >
                {!isMe && (
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0 shadow-sm mt-1`}>
                    {getInitials(msg.name)}
                  </div>
                )}
                
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  {showName && !isMe && (
                    <span className="text-[11px] font-bold text-gray-500 mb-1 ml-1">{msg.name}</span>
                  )}
                  <div className={`relative px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                    isMe 
                      ? 'bg-[#bc2a24] text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                    <span className={`text-[9px] mt-1 block opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={sendMessage} className="relative flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escreve uma mensagem..."
            className="flex-1 bg-gray-50 border-none px-5 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm text-gray-800 placeholder:text-gray-400"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="bg-[#bc2a24] text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:shadow-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
