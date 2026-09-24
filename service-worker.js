const CACHE_NAME = "verde-wallet-v5";

const FILES_TO_CACHE = [

    "./",
    "./index.html",
    "./manifest.json",

    // CSS
    "./css/variables.css",
    "./css/layout.css",
    "./css/cards.css",
    "./css/components.css",
    "./css/modal.css",
    "./css/transactions.css",
    "./css/animations.css",

    // JavaScript
    "./js/storage.js",
    "./js/theme.js",
    "./js/navigation.js",
    "./js/chart.js",
    "./js/budget.js",
    "./js/transactions.js",
    "./js/backup.js",
    "./js/easteregg.js",
    "./js/app.js",

    // Libraries
    "./libs/chart.min.js",

    "./fonts/MaterialSymbolsRounded-VariableFont_FILL,GRAD,opsz,wght.ttf",

];


// INSTALL
self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                console.log("Verde: Caching app files...");

                return cache.addAll(FILES_TO_CACHE);

            })

    );

});


// FETCH
self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(cachedResponse => {

                // Use cached file if available
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise request it from the network
                return fetch(event.request);

            })

    );

});


// ACTIVATE
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(cacheNames => {

            return Promise.all(

                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))

            );

        })

    );

});