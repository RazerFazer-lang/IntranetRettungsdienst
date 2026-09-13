const VERSION='rd-intranet-v6';
const STATIC=['./index.html','./styles.css','./enhancements.css','./search-preview.css','./search-preview-v2.css','./app.js','./data.js','./meds.js','./search-preview.js','./search-preview-v2.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(VERSION).then(c=>c.addAll(STATIC)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET') return;
 const url=new URL(e.request.url);
 const same=url.origin===self.location.origin;
 if(!same) return;
 e.respondWith((async()=>{
   try {
     const fresh=await fetch(e.request,{cache:'no-store'});
     const copy=fresh.clone();
     caches.open(VERSION).then(c=>c.put(e.request,copy)).catch(()=>{});
     return fresh;
   } catch(err) {
     return (await caches.match(e.request)) || (await caches.match('./index.html'));
   }
 })());
});
