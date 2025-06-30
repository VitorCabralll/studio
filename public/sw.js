/**
 * Service Worker for LexAI
 * Caches static assets and API responses for better performance
 */

const CACHE_NAME = 'lexai-v1';
const STATIC_CACHE = 'lexai-static-v1';
const API_CACHE = 'lexai-api-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/_next/static/css/',
  '/_next/static/chunks/',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS.filter(url => url !== '/_next/static/css/' && url !== '/_next/static/chunks/'));
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle static assets
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((fetchResponse) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).then((response) => {
        // Only cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(API_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Fallback to cache if network fails
        return caches.open(API_CACHE).then((cache) => {
          return cache.match(request);
        });
      })
    );
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(request).then((fetchResponse) => {
        // Don't cache if not ok
        if (!fetchResponse.ok) {
          return fetchResponse;
        }
        
        const responseClone = fetchResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
        
        return fetchResponse;
      });
    })
  );
});

// Background sync for offline actions (future feature)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle offline actions when connection is restored
  return Promise.resolve();
}

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'Abrir LexAI',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Fechar',
          icon: '/icon-192x192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});