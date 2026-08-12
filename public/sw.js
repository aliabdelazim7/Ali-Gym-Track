// Ali Gym Track Service Worker for iOS & Android Web Push Notifications
const CACHE_NAME = 'ali-gym-track-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let payload = { title: '🏋️ حان وقت الجيم يا بشمهندس علي!', body: 'معاد تمرين اليوم 8:00 مساءً! جاهز لكسر الأرقام؟ 🚀' };
  try {
    if (event.data) payload = event.data.json();
  } catch(_e){}

  const options = {
    body: payload.body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [300, 100, 300],
    data: { url: '/' },
    tag: 'gym-reminder-8pm'
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
