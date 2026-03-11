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

        // 3. Obter Info do Sistema/Navegador
        const userAgent = navigator.userAgent
        let device = '💻 PC / Desconhecido'
        if (/Android/i.test(userAgent)) device = '📱 Android'
        else if (/iPhone|iPad|iPod/i.test(userAgent)) device = '📱 iOS'
        else if (/Windows/i.test(userAgent)) device = '💻 Windows'
        else if (/Mac/i.test(userAgent)) device = '💻 macOS'
        else if (/Linux/i.test(userAgent)) device = '💻 Linux'

        let browser = 'Desconhecido'
        if (/Edg/i.test(userAgent)) browser = 'Edge'
        else if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) browser = 'Chrome'
        else if (/Firefox/i.test(userAgent)) browser = 'Firefox'
        else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = 'Safari'
        else if (/MSIE|Trident/i.test(userAgent)) browser = 'Internet Explorer'

        // 4. Preparar Dados
        const payload = {
          embeds: [
            {
              title: '🚀 Novo Acesso Detetado',
              color: 0xE11D48,
              fields: [
                { name: '🌐 IP', value: ip || 'Unknown', inline: true },
                { name: '📍 Localização (IP)', value: `${city}, ${region}, ${country_name}` || 'Unknown', inline: true },
                { name: '🏢 Rede/ISP', value: org || 'Unknown', inline: false },
                { name: '📱 Dispositivo/OS', value: device, inline: true },
                { name: '🌐 Navegador', value: browser, inline: true }
              ],
              timestamp: new Date().toISOString()
            }
          ]
        }

        // 5. Enviar para Discord
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
