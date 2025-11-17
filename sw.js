const CACHE_NAME = 'roberts-indoor-solutions-cache-v3';
const API_CACHE_NAME = 'roberts-api-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.css',
];

const API_ORIGIN = 'https://corsproxy.io';

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened static cache');
        return cache.addAll(urlsToCache).catch(err => {
            console.warn('Could not cache all static assets:', err);
        });
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
    const { url } = event.request;

    // Handle API requests with a stale-while-revalidate strategy
    if (url.startsWith(API_ORIGIN)) {
        event.respondWith(
            caches.open(API_CACHE_NAME).then(cache => {
                return cache.match(event.request).then(cachedResponse => {
                    const fetchPromise = fetch(event.request).then(networkResponse => {
                        // If we get a valid response, update the cache
                        if (networkResponse && networkResponse.ok) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(error => {
                        console.warn('Fetch failed; returning cached response if available.', error);
                    });

                    // Return cached response immediately if available, otherwise wait for fetch
                    return cachedResponse || fetchPromise;
                });
            })
        );
        return;
    }
    
    // For all other requests, use a cache-first strategy
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Cache hit - return response
            if (response) {
                return response;
            }

            // Not in cache, fetch it from the network
            return fetch(event.request).then(
                response => {
                    // Check if we received a valid response. Basic type means it's from our origin.
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                }
            ).catch(() => {
                // If fetching a static asset fails (e.g., offline on first visit),
                // you might want to return a fallback page, but for now, we'll let it fail.
            });
        })
    );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME, API_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});