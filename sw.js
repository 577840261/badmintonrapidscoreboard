self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('badminton-score-v1').then(function(cache) {
            return cache.addAll([
                '/badminton-score.html',
                '/'
            ]);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});