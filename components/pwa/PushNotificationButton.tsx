'use client'

import { useState, useEffect } from 'react'
import { Bell, BellRing } from 'lucide-react'

// Convert base64 to Uint8Array
const urlB64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function PushNotificationButton() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      checkSubscription()
    } else {
      setLoading(false)
    }
  }, [])

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (e) {
      console.error('Error checking push subscription:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    try {
      setLoading(true)
      const registration = await navigator.serviceWorker.ready
      
      if (isSubscribed) {
        // Unsubscribe
        const subscription = await registration.pushManager.getSubscription()
        if (subscription) {
          await subscription.unsubscribe()
          // Optionally notify server
        }
        setIsSubscribed(false)
      } else {
        // Subscribe
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidPublicKey) {
          console.error('No VAPID key found')
          setLoading(false)
          return
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(vapidPublicKey),
        })

        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        })

        setIsSubscribed(true)
      }
    } catch (e) {
      console.error('Push subscription failed:', e)
    } finally {
      setLoading(false)
    }
  }

  if (!isSupported) return null

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all ${
        isSubscribed 
          ? 'bg-[#bc2a24] text-white shadow-[#bc2a24]/30' 
          : 'bg-white text-gray-400 border border-gray-100'
      }`}
    >
      {isSubscribed ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
    </button>
  )
}
