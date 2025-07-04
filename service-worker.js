const CACHE_NAME = 'ai-toolz-cache-v1';
const OFFLINE_URL = 'offline.html';

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/main.js',
  '/tools.json',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(res => res || caches.match(OFFLINE_URL))
    )
  );
});
