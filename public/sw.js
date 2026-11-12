/* PDF Studio offline service worker.
   Strategy: HTML is network-first so pages are never stale; hashed static
   assets (/_next/static, /brand, /fonts, pdf.js support files) are
   cache-first because their URLs change when bytes change. API calls and
   third-party requests are never intercepted. */
const VERSION = 'psw-1';
const RUNTIME = VERSION + '-runtime';
const OFFLINE_URL = '/offline';
const PRECACHE = ['/', OFFLINE_URL, '/manifest.webmanifest'];
const STATIC_PATHS = /^\/(_next\/static|brand|fonts|cmaps|standard_fonts|vendor)\//;
const STATIC_FILES = /^\/(pdf\.worker\.min\.mjs|favicon\.(ico|svg))$/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(RUNTIME).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(RUNTIME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  if (STATIC_PATHS.test(url.pathname) || STATIC_FILES.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((hit) => {
        if (hit) return hit;
        return fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(RUNTIME).then((cache) => cache.put(req, copy));
          }
          return res;
        });
      })
    );
  }
});
