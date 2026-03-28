#!/usr/bin/env node

/**
 * Generate Service Worker Script
 * Creates a service worker with the correct build asset filenames
 */

const fs = require('fs');
const path = require('path');

const generateServiceWorker = () => {
  const buildDir = path.join(__dirname, '../build');
  const publicDir = path.join(__dirname, '../public');
  const serviceWorkerPath = path.join(buildDir, 'service-worker.js');
  
  // Get actual build filenames
  const cssDir = path.join(buildDir, 'static/css');
  const jsDir = path.join(buildDir, 'static/js');
  const imagesDir = path.join(buildDir, 'static/images');
  
  let cssFile = null;
  let jsFile = null;
  let imageFiles = [];
  
  // Find CSS file
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css') && !f.endsWith('.map'));
    cssFile = cssFiles[0];
  }
  
  // Find JS file
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && !f.endsWith('.map'));
    jsFile = jsFiles[0];
  }
  
  // Find image files
  if (fs.existsSync(imagesDir)) {
    imageFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.ico'));
  }
  
  // Create service worker content
  const staticAssetsList = [
    '/',
    `/static/css/${cssFile || 'main.css'}`,
    `/static/js/${jsFile || 'main.js'}`,
    ...imageFiles.map(img => `/static/images/${img}`)
  ];
  
  const serviceWorkerContent = `const CACHE_NAME = 'edmond-porter-v1';
const STATIC_CACHE = 'static-v1';
const CONTENT_CACHE = 'content-v1';

// Files to cache for offline access (dynamically generated)
const STATIC_ASSETS = [
  '/',
  '/static/css/${cssFile || 'main.css'}',
  '/static/js/${jsFile || 'main.js'}',
  ${imageFiles.map(img => `'/static/images/${img}'`).join(',\n  ')}
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets:', STATIC_ASSETS);
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker installation failed:', error);
        // Don't fail the installation, just log the error
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== CONTENT_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (request.url.includes('/static/') || request.url.includes('/images/')) {
    // Static assets - cache first strategy
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(request)
            .then((response) => {
              // Cache successful responses
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            })
            .catch(() => {
              // Return a basic offline response for images
              if (request.url.includes('/images/')) {
                return new Response('Image not available offline', { status: 503 });
              }
            });
        })
    );
  } else if (request.url.includes('/content/')) {
    // Content files - network first strategy
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CONTENT_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  } else {
    // HTML pages - network first with cache fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((response) => {
              return response || caches.match('/');
            });
        })
    );
  }
});

// Background sync for content updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName === CONTENT_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }
});

// Push notification support
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/static/images/Edmond_Headshot.webp',
      badge: '/static/images/Edmond_Headshot.webp',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification('Edmond A Porter', options)
    );
  }
});
`;
  
  // Write service worker to build directory
  fs.writeFileSync(serviceWorkerPath, serviceWorkerContent);
  console.log('✅ Service worker generated successfully!');
  console.log(`📄 Assets to cache: ${staticAssetsList.length} files`);
  console.log(`📄 CSS: ${cssFile}`);
  console.log(`📄 JS: ${jsFile}`);
  console.log(`📄 Images: ${imageFiles.length} files`);
};

// Run the function
generateServiceWorker();
