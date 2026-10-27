// v2: eski keshni o'chiradi va doim yangi versiyani internetdan oladi
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.map(x=>caches.delete(x)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(r=>{const c=r.clone();caches.open('otyoli-v2').then(h=>h.put(e.request,c)).catch(()=>{});return r})
    .catch(()=>caches.match(e.request))
  );
});
