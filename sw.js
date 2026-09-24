const CACHE_NAME = "verde-v4-1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",

    "./css/variables.css",
    "./css/layout.css",
    "./css/cards.css",
    "./css/components.css",
    "./css/modal.css",
    "./css/transactions.css",
    "./css/animations.css",

    "./js/storage.js",
    "./js/theme.js",
    "./js/navigation.js",
    "./js/chart.js",
    "./js/budget.js",
    "./js/transactions.js",
    "./js/backup.js",
    "./js/easteregg.js",
    "./js/app.js",

    "./libs/chart.min.js",

    "./icons/icon-192.png",
    "./icons/icon-512.png"
];


self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))

    );

});


self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(response => response || fetch(event.request))

    );

});


self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys =>

            Promise.all(

                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))

            )

        )

    );

});