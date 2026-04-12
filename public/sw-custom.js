// public/sw.js - Custom Service Worker
// next-pwa will auto-generate the main sw, this is for custom caching logic

const CACHE_NAME = 'semana-maior-v1'
const STATIC_CACHE = 'semana-maior-static-v1'
const DYNAMIC_CACHE = 'semana-maior-dynamic-v1'

const STATIC_ASSETS = [
  '/',
  '/schedule',
  '/tournament',
  '/leaderboard',
  '/talents',
  '/gallery',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

// Fetch - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip API routes (always need fresh data)
  if (url.pathname.startsWith('/api/')) return

  event.respondWith(
    fetch(request)
      .then((response) => {
        const cloned = response.clone()
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, cloned)
        })
        return response
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached
          // Fallback for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/')
          }
        })
      })
  )
})

// Push notifications logic removed

