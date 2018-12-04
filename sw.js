const version="v1";

// preCache
function precache(){
  return caches.open(version).then((cache)=>{
    return cache.addAll([
      "./index.html",
      "./css",
      "./js",
      "./img"
    ]);
  });
}

// fromCache
function fromCache(request){
  return caches.open(version).then(function(cache){
    return cache.match(request).then(function(matching){
      return matching||Promise.reject("no-match");
    });
  });
}

// update
function update(request){
  return caches.open(version).then((cache)=>{
    return fetch(request).then((response)=>{
      return cache.put(request,response);
    });
  });
}

// install
self.addEventListener("install",(e)=>{
  e.waitUntil(precache());
  console.log('%c Service Worker: Installed!','color:#00b9b8');

});

// fetch
self.addEventListener("fetch",(e)=>{
  e.respondWith(fromCache(e.request));
  e.waitUntil(update(e.request));
  console.log('%c Service Worker: Fetched Cache!','color:#00b9b8');
});