const CACHE_NAME = 'neurolog-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/constants.js',
  '/js/driveService.js',
  '/js/render.js',
  '/js/store.js',
  '/manifest.json'
  // Vite procesará esto y generará nombres con hash en producción, 
  // pero esta estrategia básica sirve para el esqueleto.
];

// Instalar: Cachear archivos básicos
self.addEventListener('install', (event) => {
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
    })
  );
});

// Interceptar peticiones: Estrategia "Cache First, then Network"
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones a Google APIs (Auth/Drive) para no romper el login
  if (event.request.url.includes('googleapis') || event.request.url.includes('googleusercontent')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si está en cache, devolverlo (Offline mode)
      if (cachedResponse) {
        return cachedResponse;
      }
      // Si no, ir a internet
      return fetch(event.request);
    })
  );
});