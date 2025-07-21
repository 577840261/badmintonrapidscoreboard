const CACHE_NAME = 'badminton-score-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/icon-192.png',
  '/images/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(cached => {
        // 网络优先，失败时使用缓存
        return cached || fetch(e.request)
          .then(response => {
            // 动态缓存新资源
            return caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(e.request, response.clone());
                return response;
              });
          }).catch(() => {
            // 对于HTML文档，返回缓存的首页
            if (e.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
          });
      })
  );
});