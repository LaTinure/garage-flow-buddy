const CACHE_NAME = 'garage-manager-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  // Ajoute d'autres assets statiques si besoin
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
