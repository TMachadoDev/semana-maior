'use client'

import { useEffect } from 'react'

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1481294696943718524/xiuKXohBdcaRa9pCJG0SYoIKgKqaww7XLtK2xcC93X0UwNxPbJubVAvdzC74rva7wJYO' // SUBSTITUI PELO TEU URL REAL

export function Tracker() {
  useEffect(() => {
    const trackUser = async () => {
      // 1. Verificar se já foi rastreado
      const alreadyTracked = localStorage.getItem('sm_tracked')
      if (alreadyTracked) return

      try {
        // 2. Recolher Informações Básicas
        const ua = navigator.userAgent
        const platform = navigator.platform
        const language = navigator.language
        const screenRes = `${window.screen.width}x${window.screen.height}`
        
        // Network Info (Limitado por segurança)
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
        const networkType = connection ? connection.effectiveType : 'unknown'

        // 3. Obter IP (via serviço externo)
        let ip = 'Unknown'
        try {
          const ipRes = await fetch('https://api.ipify.org?format=json')
          const ipData = await ipRes.json()
          ip = ipData.ip
        } catch (e) {
          console.error('Erro ao obter IP')
        }

        // 4. Obter Geolocalização (Pede permissão)
        let location = 'Recusada/Não suportada'
        
        const getPosition = () => {
          return new Promise((resolve) => {
            if (!navigator.geolocation) {
              resolve('Não suportada')
              return
            }
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                resolve(`Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude} (+/- ${pos.coords.accuracy}m)`)
              },
              () => resolve('Recusada'),
              { timeout: 10000 }
            )
          })
        }

        location = (await getPosition()) as string

        // 5. Preparar Dados
        const payload = {
          content: '🚀 **Novo Acesso Detetado na Semana Maior**',
          embeds: [
            {
              title: 'Informações do Visitante',
              color: 12331556, // Vermelho SM
              fields: [
                { name: '🌐 IP', value: ip, inline: true },
                { name: '📍 Localização', value: location, inline: true },
                { name: '📱 Sistema Operativo', value: platform, inline: true },
                { name: '🧭 Navegador', value: ua.split(' ').pop() || 'Unknown', inline: true },
                { name: '📶 Rede', value: networkType, inline: true },
                { name: '🖥️ Resolução', value: screenRes, inline: true },
                { name: '🌍 Língua', value: language, inline: true },
                { name: '📄 User Agent', value: `\`\`\`${ua}\`\`\`` }
              ],
              timestamp: new Date().toISOString()
            }
          ]
        }

        // 6. Enviar para Discord
        if (DISCORD_WEBHOOK_URL !== 'https://discord.com/api/webhooks/1481294696943718524/xiuKXohBdcaRa9pCJG0SYoIKgKqaww7XLtK2xcC93X0UwNxPbJubVAvdzC74rva7wJYO') {
          await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
        }

        // 7. Guardar no LocalStorage para não repetir
        localStorage.setItem('sm_tracked', JSON.stringify({
          timestamp: new Date().toISOString(),
          ip,
          location
        }))

      } catch (error) {
        console.error('Erro no tracker:', error)
      }
    }

    trackUser()
  }, [])

  return null
}
