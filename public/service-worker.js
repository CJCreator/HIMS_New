const CACHE_NAME = 'hims-v2';
const STATIC_CACHE = 'hims-static-v2';
const API_CACHE = 'hims-api-v2';
const FORM_CACHE = 'hims-forms-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg'
];

// API endpoints to cache
const apiEndpoints = [
  '/api/patients',
  '/api/appointments',
  '/api/prescriptions',
  '/api/vitals'
];

// Forms to cache offline
const formsToCache = [
  '/patient-registration',
  '/appointment-booking',
  '/prescription-form'
];

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(urlsToCache)),
      caches.open(FORM_CACHE).then(cache => cache.addAll(formsToCache))
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.filter(n => !['hims-static-v2', 'hims-api-v2', 'hims-forms-v2'].includes(n))
          .map(n => caches.delete(n))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (request.destination === 'style' || request.destination === 'script' ||
      request.destination === 'image' || request.destination === 'font') {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Default cache-first strategy
  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});

async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE);

  // Try cache first for GET requests
  if (request.method === 'GET') {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      // Return cached response and update in background
      fetch(request).then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {
        // Network failed, keep cached version
      });
      return cachedResponse;
    }
  }

  // Network first, fallback to cache
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && request.method === 'GET') {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline response for critical endpoints
    if (apiEndpoints.some(endpoint => request.url.includes(endpoint))) {
      return new Response(JSON.stringify({
        error: 'Offline',
        message: 'Data not available offline. Please check your connection.'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    throw error;
  }
}

async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline fallback for critical assets
    if (request.url.includes('main') || request.url.includes('index')) {
      return new Response('Offline - Asset not available', { status: 503 });
    }
    throw error;
  }
}

async function handleNavigationRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match('/');

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    return await fetch(request);
  } catch (error) {
    // Return cached index.html for offline navigation
    const indexResponse = await cache.match('/index.html');
    return indexResponse || new Response('Offline - Page not available', { status: 503 });
  }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  // Implement offline data synchronization
  // This would typically sync pending mutations when back online
  console.log('Syncing offline data...');
}

// Handle messages from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
