import webpush from 'web-push'
import { prisma } from './prisma'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
)

export async function sendNotificationToAll(payload: any) {
  try {
    const subscriptions = await prisma.pushSubscription.findMany()
    
    if (subscriptions.length === 0) return

    const stringPayload = JSON.stringify(payload)
    
    const sendPromises = subscriptions.map((sub) => {
      const pushSub = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      }
      
      return webpush.sendNotification(pushSub, stringPayload).catch(async (error) => {
        if (error.statusCode === 404 || error.statusCode === 410) {
          // A subscrição já não é válida
          console.log('Subscription expired or removed, deleting...', sub.endpoint)
          await prisma.pushSubscription.delete({ where: { id: sub.id } })
        } else {
          console.error('Push notification failed:', error)
        }
      })
    })

    await Promise.all(sendPromises)
  } catch (error) {
    console.error('Error sending mass notification:', error)
  }
}
