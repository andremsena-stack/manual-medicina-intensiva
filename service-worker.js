const CACHE_NAME = 'manual-medicina-intensiva-codex-v3';
const ASSETS = [
  "./",
  "./index.html",
  "./assets/css/manual.css",
  "./assets/js/manual-library.js",
  "./manifest.webmanifest",
  "./manual_medicina_intensiva_modulos_1_6_consolidado_autonomo_codex.html"
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
