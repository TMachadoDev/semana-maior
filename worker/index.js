self.addEventListener('push', function (event) {
  if (!event.data) return;
  try {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title || 'Semana Maior', {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        data: { url: data.url || '/' },
      })
    );
  } catch (e) {
    console.error('Push event error', e);
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
