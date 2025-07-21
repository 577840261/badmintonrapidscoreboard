const CACHE_NAME = 'badminton-score-v2'; // 添加缺失的缓存名称常量
const ASSETS = [
  '/',
  '/index.html',
  '/images/icon-192.png',
  '/images/icon-512.png'
]; // 移除不存在的CSS/JS引用

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (e) => {
  // 在fetch事件处理中添加
  if (e.request.url.includes('canvas')) {
    // 特殊处理Canvas请求
    e.respondWith(new Response(JSON.stringify(backgroundStyles), {
      headers: { 'Content-Type': 'application/json' }
    }));
  }
  e.respondWith(
    caches.match(e.request)
      .then(cached => {
        // 网络优先，失败时使用缓存
        return fetch(e.request)
          .then(response => {
            // 动态缓存新资源
            return caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(e.request, response.clone());
                return response;
              });
          })
          .catch(() => cached || caches.match('/')); // 优化缓存回退逻辑
      })
  );
});