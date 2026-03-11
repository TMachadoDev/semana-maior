'use client'

import { useEffect } from 'react'

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1481294696943718524/xiuKXohBdcaRa9pCJG0SYoIKgKqaww7XLtK2xcC93X0UwNxPbJubVAvdzC74rva7wJYO'

export function Tracker() {
  useEffect(() => {
    const trackUser = async () => {
      // 1. Verificar se o nome existe, senão esperar pelo evento
      const userName = localStorage.getItem('sm_user_name')
      if (!userName) return

      // 2. Verificar se já foi rastreado nesta sessão
      const alreadyTracked = sessionStorage.getItem('sm_tracked')
      if (alreadyTracked) return

      try {
        let deviceId = localStorage.getItem('sm_device_id')
        if (!deviceId) {
          deviceId = 'DEV-' + Math.random().toString(36).substring(2, 15).toUpperCase()
          localStorage.setItem('sm_device_id', deviceId)
        }

        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()

        const ua = navigator.userAgent
        const screenRes = `${window.screen.width}x${window.screen.height}`
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const memory = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory}GB` : 'N/A'
        
        let batteryInfo = 'N/A'
        try {
          if ('getBattery' in navigator) {
            const battery: any = await (navigator as any).getBattery()
            batteryInfo = `${Math.round(battery.level * 100)}% (${battery.charging ? 'A carregar' : 'Em bateria'})`
          }
        } catch (e) {}

        const payload = {
          embeds: [
            {
              title: `👤 ${userName} acedeu ao site!`,
              color: 0x22C55E, // Verde para indicar que o utilizador está identificado
              fields: [
                { name: '🆔 Device ID', value: `\`${deviceId}\``, inline: false },
                { name: '🌐 IP & Rede', value: `${data.ip}\n${data.org}`, inline: true },
                { name: '📍 Localização', value: `${data.city}, ${data.country_name}`, inline: true },
                { name: '📱 Sistema', value: `${navigator.platform}\n${ua.includes('iPhone') ? 'iPhone' : ua.includes('Android') ? 'Android' : 'PC'}`, inline: true },
                { name: '🖥️ Ecrã & UI', value: `Res: ${screenRes}\nTZ: ${timezone}`, inline: true },
                { name: '⚙️ Hardware', value: `RAM: ${memory}\nBat: ${batteryInfo}`, inline: true },
                { name: '🔗 Origem', value: document.referrer || 'Acesso Direto', inline: false }
              ],
              footer: { text: `User Agent: ${ua.substring(0, 100)}...` },
              timestamp: new Date().toISOString()
            }
          ]
        }

        await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        sessionStorage.setItem('sm_tracked', 'true')
      } catch (error) {
        console.error('Erro no tracker:', error)
      }
    }

    trackUser()
  }, [])

  return null
}
