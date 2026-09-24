const CACHE_NAME = "verde-wallet-v4";

const FILES = [
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
  "./js/app.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
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

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});