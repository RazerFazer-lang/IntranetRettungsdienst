const CACHE='rd-intranet-v15';
const SHELL=['./','./index.html','./styles.css','./enhancements.css','./search-preview-v2.css','./search-layer-v6.css','./checklists.css','./checklists-enhanced.css','./notfallbilder.css','./manv.css','./krankheiten.css','./app.js','./data.js','./meds.js','./checklists.js','./notfallbilder.js','./search-preview-v2.js','./manv.js','./krankheiten.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))))});
