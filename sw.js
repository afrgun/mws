var CACHE_NAME = 'afrgun-cache-v1';
var urlsToCache = [
  '/',
  '/index.html',
  '/main.js',
  '/sw.js',
  '/icon.png',
  'avatar.jpg',
  'manifest.json',
  '/404.html',
  '/friendship.png',
  '/project1/add2numbers.js',
  '/project1/add2numbers.html',
  '/project2/css/mystyle.css',
  '/project2/index.html'
]

self.addEventListener('install', function(event){
    // install step
    console.log('installing service worker')
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache){
            console.log('Opened cache')
            return cache.addAll(urlsToCache)
        })
    )
});

self.addEventListener('activate', function(event){
  // step
  console.log('activated service worker')
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }

          var fetchRequest = event.request.clone();

          return fetch(fetchRequest).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              var responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });

              return response;
            }
          );          
        }
      )
    );
});

