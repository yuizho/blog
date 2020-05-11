const cacheName = 'v1-yuizho-blog';

// Call Install Event
self.addEventListener('install', event => {
    console.log("Service Worker: Installed");
});

//  Call Activate Event
self.addEventListener('activate', event => {
    console.log("Service Worker: Activated");

    //  Remove unwanted  caches (the caches in the older version Cache Stroage)
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log("Service Worker: Clearing Old Cache");
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});

// Call Fetch Event
self.addEventListener('fetch', event => {
    console.log('Service Worker: Fetching');
    event.respondWith(async function () {
        // if the request exists in cache, return it.
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
            return cachedResponse
        }

        return fetch(event.request)
            .then(res => {
                // Make copy /clone of response
                const resClone = res.clone();
                // Open cache
                caches
                    .open(cacheName)
                    .then(cache => {
                        // add response to cache
                        cache.put(event.request, resClone);
                    });
                return res;
            }).catch(err => {
                // if there is no connection, the cache is used
                caches.match(event.request).then(res => res);
            });
    }());
});