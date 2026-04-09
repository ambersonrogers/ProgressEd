const CACHE_NAME = 'progressd-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache).catch(() => {
          console.log('Alguns arquivos não foram encontrados no cache');
        });
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Para requisições GET, usar estratégia cache-first
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }

          return fetch(event.request).then(response => {
            // Não cachear requisições que não são sucesso
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clonar a resposta
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
        })
        .catch(() => {
          // Retornar página offline se estiver offline
          return new Response('Aplicação offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        })
    );
  } else {
    // Para POST, DELETE, PUT - sempre fazer fetch
    event.respondWith(
      fetch(event.request)
        .then(response => response)
        .catch(() => {
          return new Response(JSON.stringify({ offline: true }), {
            status: 503,
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          });
        })
    );
  }
});

// Sincronizar dados quando voltar online
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    const response = await fetch('/api/sync');
    return response.json();
  } catch (error) {
    console.error('Erro ao sincronizar:', error);
    throw error;
  }
}
