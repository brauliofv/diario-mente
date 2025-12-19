const CACHE_NAME = 'neurolog-v3';
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
      console.log('Caching assets...');
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
          console.log('Removing old cache:', key);
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim())
  );
});

// Interceptar peticiones: Estrategia "Cache First" para assets locales
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorar peticiones a Google APIs (Auth/Drive)
  if (url.hostname.includes('googleapis.com') || url.hostname.includes('googleusercontent.com') || url.hostname.includes('accounts.google.com')) {
    return;
  }

  // Estrategia: Cache First, Fallback to Network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Opcional: Cachear dinámicamente nuevas peticiones del mismo origen
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Si falla todo (offline y no en cache), podrías devolver un fallback offline.html
      });
    })
  );
});