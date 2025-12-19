const CACHE_NAME = 'neurolog-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/constants.js',
  '/js/driveService.js',
  '/js/render.js',
  '/js/store.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Instalar: Cachear archivos básicos
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activar: Limpiar caches viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim())
  );
});

// Interceptar peticiones: Estrategia "Stale-While-Revalidate" para assets locales
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorar peticiones a Google APIs (Auth/Drive) para no romper el login
  if (url.hostname.includes('googleapis.com') || url.hostname.includes('googleusercontent.com') || url.hostname.includes('accounts.google.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback silencioso si falla el fetch (offline)
      });

      return cachedResponse || fetchPromise;
    })
  );
});