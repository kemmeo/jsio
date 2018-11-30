const staticAssets=[
  "./",
  "./css/style.css",
  "./app.js",
  "./img"
];

self.addEventListener("install",async event=>{
  const cache=await caches.open("app-static");
  cache.addAll(staticAssets);
  console.log("Service Worker: content cached!");
});

self.addEventListener("fetch",event=>{
  const req=event.request;
  event.respondWith(cacheFirst(req));

  console.log("Service Worker: fetched content cache!");
});

async function cacheFirst(req){
  const cachedResponse=await caches.match(req);
  return cachedResponse || fetch(req);
}