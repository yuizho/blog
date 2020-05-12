const cacheName = 'v1-yuizho-blog';

// Call Install Event
self.addEventListener('install', event => {
    console.log("Service Worker: Installed");
    event.waitUntil(self.skipWaiting());
});

//  Call Activate Event
self.addEventListener('activate', event => {
    console.log("Service Worker: Activated");
    event.waitUntil(self.clients.claim());

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
    // if  the request is image, return immediately.
    if (!/(\.webp|\.jpeg|\.jpg|\.gif|\.png)$/.test(event.request.url)) {
        return;
    }

    event.respondWith(async function () {
        // if the request exists in cache, return it.
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
            console.log(`get from cache: ${event.request.url}`);
            return cachedResponse
        }

        // if the request inexists in cache, fetch the asset and  store put into cache.
        const fetchedResponse = await fetch(event.request);
        const opennedCache = await caches.open(cacheName);
        opennedCache.put(event.request, fetchedResponse.clone());
        return fetchedResponse;
    }());
});