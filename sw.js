// Service Worker for PWA support
const CACHE_NAME = 'duty-track-police-v1.1'
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/ico.svg',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  console.log('Service Worker 安装中...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('缓存文件中...')
        return cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果缓存中有响应，就返回缓存的版本
        if (response) {
          console.log('从缓存加载:', event.request.url)
          return response
        }
        console.log('从网络加载:', event.request.url)
        return fetch(event.request)
      })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
