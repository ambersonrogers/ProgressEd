// ProgressEd - Service Worker v3 (Network-First para navegação e sem cache de APIs)
const CACHE_NAME = 'progressed-v3-stable';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Instalando e pré-armazenando assets estáticos base');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Aviso ao cachear assets iniciais:', err);
      });
    })
  );
  // Força ativação imediata sem esperar fechar as abas
  self.skipWaiting();
});

// Ativação e limpeza forçada de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purgando cache antigo:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      // Reivindica controle imediato de todas as abas abertas
      return self.clients.claim();
    })
  );
});

// Interceptação inteligente de requisições de rede
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. NUNCA interceptar nem cachear chamadas de API ou autenticação
  if (url.pathname.startsWith('/api') || url.pathname.includes('/auth') || url.pathname.includes('/challenges')) {
    return;
  }

  // 2. Não interceptar requisições que não sejam GET
  if (event.request.method !== 'GET') {
    return;
  }

  // 3. ESTRATÉGIA NETWORK-FIRST PARA NAVEGAÇÃO / HTML:
  // Garante que o usuário SEMPRE receba o index.html mais recente com os hashes corretos do Vite
  const isNavigation = event.request.mode === 'navigate' || 
                       event.request.destination === 'document' ||
                       event.request.headers.get('accept')?.includes('text/html');

  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          console.warn('[SW] Rede indisponível, servindo index.html do cache offline');
          const cached = await caches.match('/index.html') || await caches.match('/');
          if (cached) return cached;
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>ProgressEd Offline</title></head><body style="background:#030712;color:#fff;font-family:sans-serif;text-align:center;padding:50px;"><h1>⚡ ProgressEd Offline</h1><p>Você está sem conexão com a internet. Reconecte-se para continuar seus estudos.</p><button onclick="window.location.reload()" style="padding:10px 20px;border-radius:8px;background:#38bdf8;border:none;cursor:pointer;font-weight:bold;">Tentar Novamente</button></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 4. ESTRATÉGIA STALE-WHILE-REVALIDATE PARA ASSETS ESTÁTICOS (JS, CSS, Imagens, Fontes)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch((err) => {
        // Se a rede falhar e tínhamos em cache, ok
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
