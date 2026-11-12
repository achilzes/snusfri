/* Snusfri service worker — offline-first, shell is network-first */
const VERSION = 'snusfri-v11';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './fonts/fonts.css',
  './fonts/fraunces-latin.woff2',
  './fonts/fraunces-latin-ext.woff2',
  './fonts/outfit-latin.woff2',
  './fonts/outfit-latin-ext.woff2',
  './icons/hero.jpg',
  './icons/hero@2x.jpg',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png',
  './favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function isShell(req, url) {
  const path = url.pathname;
  const dest = req.destination;
  return (
    req.mode === 'navigate' ||
    dest === 'document' ||
    dest === 'script' ||
    dest === 'style' ||
    path.endsWith('/') ||
    path.endsWith('/index.html') ||
    path.endsWith('.html') ||
    path.endsWith('.css') ||
    path.endsWith('.js') ||
    path.endsWith('manifest.webmanifest')
  );
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (isShell(req, url)) {
    // Network-first so an installed PWA picks up CSS/JS/HTML changes
    // as soon as the new worker activates.
    event.respondWith(
      fetch(req, { cache: 'no-cache' })
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((c) => c || caches.match('./index.html'))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const fetched = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});


self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        if (c.url && 'focus' in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
