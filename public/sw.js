const CACHE_NAME = 'vitor-forms-v6';
const urlsToCache = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

// Install event - cache resources and force immediate activation
self.addEventListener('install', (event) => {
  console.log('Service Worker installing - version:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Fetch event - network first, cache fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Não cachear requisições não-GET ou de outras origens
        if (event.request.method !== 'GET' || !response || response.status !== 200) {
          return response;
        }
        
        // Só cachear assets estáticos, não HTML/JS/CSS principais
        const url = new URL(event.request.url);
        if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/)) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        
        return response;
      })
      .catch(() => {
        // Se falhar, tenta o cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // Se for navegação e não houver cache, retorna offline page
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});