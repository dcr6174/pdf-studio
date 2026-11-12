/* PDF Studio offline service worker.
   Strategy: HTML is network-first so pages are never stale; hashed static
   assets (/_next/static, /brand, /fonts, pdf.js support files) are
   cache-first because their URLs change when bytes change. API calls and
   third-party requests are never intercepted. */
const VERSION = 'psw-2';
const RUNTIME = VERSION + '-runtime';
const OFFLINE_URL = '/offline';
const PRECACHE = ['/', OFFLINE_URL, '/manifest.webmanifest'];
// Most-used tool pages. Their HTML and the hashed JS/CSS they reference are
// cached at install so these tools open offline without a prior visit.
const TOOL_PAGES = ['/tools/merge-pdf', '/tools/split-pdf', '/tools/compress-pdf', '/tools/sign-pdf', '/tools/pdf-to-jpg', '/tools/pdf-reader'];
// Large engine files, cached after activation and skipped on Data Saver or
// slow connections. They are also cached on first use by the fetch handler.
const HEAVY = ['/vendor/pdfium.wasm', '/pdf.worker.min.mjs'];
const ASSET_REF = /\/_next\/static\/[^"'\\\s)]+\.(?:js|css|woff2?)/g;

function slowConnection() {
  const c = self.navigator && self.navigator.connection;
  return !!c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''));
}

async function precacheTools(cache) {
  const assets = new Set();
  await Promise.allSettled(TOOL_PAGES.map(async (path) => {
    const res = await fetch(path, { credentials: 'same-origin' });
    if (!res.ok) return;
    const html = await res.clone().text();
    (html.match(ASSET_REF) || []).forEach((u) => assets.add(u));
    await cache.put(path, res);
  }));
  await Promise.allSettled([...assets].map(async (u) => {
    if (await cache.match(u)) return;
    const res = await fetch(u);
    if (res.ok) await cache.put(u, res);
  }));
}

async function precacheHeavy(cache) {
  if (slowConnection()) return;
  await Promise.allSettled(HEAVY.map(async (u) => {
    if (await cache.match(u)) return;
    const res = await fetch(u);
    if (res.ok) await cache.put(u, res);
  }));
}
const STATIC_PATHS = /^\/(_next\/static|brand|fonts|cmaps|standard_fonts|vendor)\//;
const STATIC_FILES = /^\/(pdf\.worker\.min\.mjs|favicon\.(ico|svg))$/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(RUNTIME)
      .then((cache) => cache.addAll(PRECACHE).then(() => precacheTools(cache)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => caches.open(RUNTIME).then(precacheHeavy))
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
