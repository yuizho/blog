const CACHE_NAME = 'v1-yuizho-blog';
const ORIGIN = location.origin;

const isCacheable = (request) => {
    const url = request.url;
    return url.startsWith(ORIGIN) && /(\.webp|\.jpeg|\.jpg|\.gif|\.png)$/.test(url);
}

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
                    if (cache !== CACHE_NAME) {
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
    if (!isCacheable(event.request)) {
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
        const opennedCache = await caches.open(CACHE_NAME);
        opennedCache.put(event.request, fetchedResponse.clone());
        return fetchedResponse;
    }());
});