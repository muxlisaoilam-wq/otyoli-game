/* Ot Yo‘li — service worker (v3.43)
   O‘yin fayllari keshda saqlanadi: internet bo‘lmasa ham ochiladi.
   index.html avval internetdan olinadi (yangi versiya darhol keladi), bo‘lmasa keshdan.
   Yangi versiya chiqarganda VERSION ni o‘zgartiring — eski kesh o‘chadi. */
const VERSION = 'otyoli-v3.43';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Firebase, Google kirish va boshqa tashqi manzillar — keshlanmaydi
  if (url.origin !== self.location.origin) return;

  // Sahifaning o‘zi: avval internet, bo‘lmasa kesh
  if (req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Boshqa fayllar (rasm, shrift, manifest): avval kesh, orqada yangilanadi
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
