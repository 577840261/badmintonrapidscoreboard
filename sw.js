const CACHE_NAME = 'badminton-score-v2';
const ASSETS = [
  '/',
  '/index.html',
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

// 添加activate事件处理，清理旧缓存并激活新Service Worker
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // 移除未定义的backgroundStyles引用，修复Canvas请求错误
  e.respondWith(
    caches.match(e.request)
      .then(cached => {
        // 采用缓存优先策略，同时更新缓存
        const fetchPromise = fetch(e.request)
          .then(networkResponse => {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(e.request, networkResponse.clone());
            });
            return networkResponse;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
  );
});