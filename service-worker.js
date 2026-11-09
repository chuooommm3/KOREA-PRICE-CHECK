'use strict';

const CACHE_NAME = 'price-check-shell-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key.startsWith('price-check-shell-') && key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Never intercept non-GET requests or requests to external origins (including the FX API).
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Network First for page navigations: serve the latest published HTML when online,
  // and use the last successfully cached app shell only when the network is unavailable.
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          event.waitUntil(
            caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy))
          );
        }
        return response;
      }).catch(async () => {
        const cachedPage = await caches.match('./index.html');
        if (cachedPage) return cachedPage;
        const cachedRoot = await caches.match('./');
        if (cachedRoot) return cachedRoot;
        return Response.error();
      })
    );
    return;
  }

  // Cache First for same-origin static assets (icons and manifest), with network fallback.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          event.waitUntil(
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy))
          );
        }
        return response;
      });
    })
  );
});
