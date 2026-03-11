'use client'

import { useEffect } from 'react'

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1481294696943718524/xiuKXohBdcaRa9pCJG0SYoIKgKqaww7XLtK2xcC93X0UwNxPbJubVAvdzC74rva7wJYO'

export function Tracker() {
  useEffect(() => {
    const trackUser = async () => {
      // 1. Verificar se já foi rastreado nesta sessão
      const alreadyTracked = sessionStorage.getItem('sm_tracked')
      if (alreadyTracked) return

      try {
        // 2. Obter IP e Localização via IP (Não pede permissão ao utilizador)
        // Usamos o ipapi.co que resolve a localização automaticamente pelo IP
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()

        const {
          ip,
          city,
          region,
          country_name,
          org // ISP/Rede
        } = data

        // 3. Preparar Dados
        const payload = {
          embeds: [
            {
              title: '🚀 Novo Acesso Detetado',
              color: 0xE11D48,
              fields: [
                { name: '🌐 IP', value: ip || 'Unknown', inline: true },
                { name: '📍 Localização (IP)', value: `${city}, ${region}, ${country_name}` || 'Unknown', inline: true },
                { name: '🏢 Rede/ISP', value: org || 'Unknown', inline: false }
              ],
              timestamp: new Date().toISOString()
}
          ]
        }

        // 4. Enviar para Discord
        await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        // 5. Marcar como rastreado
        sessionStorage.setItem('sm_tracked', 'true')

      } catch (error) {
        console.error('Erro no tracker:', error)
      }
    }

    trackUser()
  }, [])

  return null
}
