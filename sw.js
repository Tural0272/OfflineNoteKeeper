
const CACHE_NAME = 'offline-notes-v1';
const ASSETS = [
    './',
    './index.html',
    './editor.html',
    './settings.html',
    './about.html',
    './help.html',
    './css/style.css',
    './js/app.js',
    './js/notes.js',
    './js/editor.js',
    './js/camera.js',
    './js/speech.js',
    './js/storage.js',
    './js/settings.js',
    './icons/icon-144x144.png',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Cache local assets
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => cacheName !== CACHE_NAME)
                        .map(cacheName => caches.delete(cacheName))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch Event Handler with Network First, falling back to cache
self.addEventListener('fetch', event => {
    // Skip POST requests
    if (event.request.method === 'POST') {
        return;
    }

    // Network first strategy
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cache successful responses
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, responseClone))
                        .catch(err => console.log('Cache put error:', err));
                }
                return response;
            })
            .catch(() => {
                // Fallback to cache
                return caches.match(event.request)
                    .then(response => response || caches.match('./index.html'));
            })
    );
});

// Handle push notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        icon: './icons/icon-192x192.png',
        badge: './icons/icon-192x192.png'
    };

    event.waitUntil(
        self.registration.showNotification('Notes App', options)
    );
});

// Handle reminders
const reminders = new Map();

self.addEventListener('message', event => {
    const message = event.data;

    switch (message.type) {
        case 'SET_REMINDER':
            const { id, title, time } = message.reminder;
            const delay = time - Date.now();

            if (delay > 0) {
                const timeoutId = setTimeout(() => {
                    self.registration.showNotification('Note Reminder', {
                        body: title,
                        icon: './icons/icon-192x192.png',
                        badge: './icons/icon-192x192.png',
                        vibrate: [200, 100, 200],
                        tag: id
                    });
                    reminders.delete(id);
                }, delay);

                reminders.set(id, timeoutId);
            }
            break;

        case 'CLEAR_REMINDERS':
            reminders.forEach(timeoutId => clearTimeout(timeoutId));
            reminders.clear();
            break;
    }
});
