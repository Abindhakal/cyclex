// =============================
// CycleX Pro - service-worker.js
// =============================

const CACHE_NAME = "cyclex-pro-v1";

// Files to cache (core app shell)
const CACHE_FILES = [
    "./",
    "./index.html",
    "./css/style.css",

    "./js/app.js",
    "./js/gps.js",
    "./js/gauges.js",
    "./js/weather.js",
    "./js/storage.js",
    "./js/speech.js",
    "./js/goals.js",
    "./js/gpx.js",
    "./js/compass.js",

    "./manifest.json"
];

// =============================
// INSTALL EVENT
// =============================

self.addEventListener("install", (event) => {

    console.log("Service Worker: Installing...");

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(CACHE_FILES);
            })
    );

    self.skipWaiting();
});

// =============================
// ACTIVATE EVENT
// =============================

self.addEventListener("activate", (event) => {

    console.log("Service Worker: Activated");

    event.waitUntil(
        caches.keys().then((keys) => {

            return Promise.all(
                keys.map((key) => {

                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }

                })
            );

        })
    );

    self.clients.claim();
});

// =============================
// FETCH EVENT (Offline support)
// =============================

self.addEventListener("fetch", (event) => {

    event.respondWith(

        caches.match(event.request)
            .then((cached) => {

                // Return cache if exists
                if (cached) {
                    return cached;
                }

                // Otherwise fetch from network
                return fetch(event.request)
                    .then((response) => {

                        // Cache new requests dynamically
                        return caches.open(CACHE_NAME)
                            .then((cache) => {

                                cache.put(event.request, response.clone());

                                return response;

                            });

                    })
                    .catch(() => {

                        // Fallback if offline and not cached
                        if (event.request.mode === "navigate") {
                            return caches.match("./index.html");
                        }

                    });

            })

    );

});