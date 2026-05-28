// Service Worker — Manual Virtus Intensiva
// Estratégia: NETWORK-FIRST para tudo (HTML, JS, CSS, assets).
// Cache funciona apenas como fallback offline. Evita o problema clássico
// de bundle JS com hash novo + index.html novo mas cache servindo hash
// antigo que não existe mais no deploy → tela em branco no PWA iOS.
const CACHE_NAME = "guia-intensiva-pwa-v65";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./pwa-icons/icon-192.png",
  "./pwa-icons/icon-512.png",
  "./pwa-icons/icon-192-maskable.png",
  "./pwa-icons/icon-512-maskable.png",
  "./pwa-icons/apple-touch-icon.png"
];

const cacheResponse = (request, response) => {
  if (response && response.ok && response.type === "basic") {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
  }
  return response;
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  // NETWORK-FIRST para todas as requisições same-origin (GET).
  // Vantagem: bundles JS com hash sempre frescos, sem risco de o cache
  // servir um hash antigo que não existe mais.
  // Fallback: cache (último bom valor) → garante uso offline.
  event.respondWith(
    fetch(event.request)
      .then((response) => cacheResponse(event.request, response))
      .catch(() =>
        caches
          .match(event.request)
          .then((cached) => {
            if (cached) return cached;
            // Para requisições de navegação (HTML), fallback final = index.html cacheado
            const acceptsHtml = event.request.headers
              .get("accept")
              ?.includes("text/html");
            if (event.request.mode === "navigate" || acceptsHtml) {
              return caches.match("./index.html");
            }
            return new Response("Offline", {
              status: 503,
              statusText: "Offline e sem cache",
              headers: { "content-type": "text/plain; charset=utf-8" }
            });
          })
      )
  );
});

// Permite que a página force ativação imediata via postMessage.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
