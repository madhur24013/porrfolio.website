// Service Worker for caching and offline capabilities
const CACHE_NAME = 'portfolio-cache-v1';

// Assets to cache immediately on service worker install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/src/assets/logo.svg',
  '/src/assets/herobg.png',
  '/src/components/Hero.jsx',
  '/src/components/Navbar.jsx'
];

// Install event - precache key resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Strategic caching for different resource types
const HTML_CACHE_STRATEGY = {
  cache: (request, response) => {
    const responseClone = response.clone();
    caches.open(CACHE_NAME).then((cache) => {
      cache.put(request, responseClone);
    });
    return response;
  },
  network: (request) => fetch(request)
    .then((response) => HTML_CACHE_STRATEGY.cache(request, response))
    .catch(() => caches.match(request)),
  cacheFirst: (request) => 
    caches.match(request)
      .then((response) => response || HTML_CACHE_STRATEGY.network(request))
};

const IMAGE_CACHE_STRATEGY = {
  cache: (request, response) => {
    const responseClone = response.clone();
    if (response.status === 200) {
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, responseClone);
      });
    }
    return response;
  },
  network: (request) => fetch(request)
    .then((response) => IMAGE_CACHE_STRATEGY.cache(request, response))
    .catch(() => caches.match(request)),
  cacheFirst: (request) => 
    caches.match(request)
      .then((response) => response || IMAGE_CACHE_STRATEGY.network(request))
};

// Fetch event - serve from cache or network based on resource type
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (requestUrl.origin !== location.origin) {
    return;
  }
  
  // Handle HTML requests - network first with cache fallback
  if (requestUrl.pathname === '/' || requestUrl.pathname.endsWith('.html')) {
    event.respondWith(HTML_CACHE_STRATEGY.network(event.request));
    return;
  }
  
  // Handle image requests - cache first with network fallback
  if (
    requestUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/) ||
    requestUrl.pathname.includes('/assets/')
  ) {
    event.respondWith(IMAGE_CACHE_STRATEGY.cacheFirst(event.request));
    return;
  }
  
  // Default strategy - stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        // Fetch from network in background to update cache
        fetch(event.request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }).catch(() => {
          // Network fetch failed, but we already have a cached response
        });
        
        return response;
      }
      
      // Not in cache - fetch from network
      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response
        const responseToCache = response.clone();
        
        // Add to cache
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      });
    })
  );
}); 