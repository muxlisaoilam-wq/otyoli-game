// Ot Yo'li — service worker (v14)
const CACHE = 'ot-yoli-v14';
const REGIONS = 14; // index.html dagi RG=14 bilan bir xil bo'lsin

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  ...Array.from({ length: REGIONS }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return ['./' + n + '.jpg', './t' + n + '.jpg'];
  }).flat()
];

// O'rnatish: barcha fayllarni keshga olish (bittasi topilmasa ham to'xtamaydi)
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(ASSETS.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

// Faollashtirish: eski keshlarni o'chirish
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  // Faqat o'z domenidagi GET so'rovlar (Firebase, Google, gstatic — to'g'ridan-to'g'ri tarmoqdan)
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  // Auth redirect yo'llari keshlanmasin
  if (url.pathname.includes('/__/')) return;

  // Sahifa: avval tarmoq (doim yangi index), internet yo'q bo'lsa — keshdan
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put('./index.html', copy));
          }
          return res;
        })
        .catch(() =>
          caches.match('./index.html').then(r => r || caches.match('./'))
        )
    );
    return;
  }

  // Qolgan fayllar: avval kesh, fonda yangilash (stale-while-revalidate)
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req)
        .then(res => {
          if (res.ok && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
