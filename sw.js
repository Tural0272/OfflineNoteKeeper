const CACHE_NAME = 'offline-notes-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/editor.html',
    '/settings.html',
    '/about.html',
    '/help.html',
    '/css/style.css',
    '/js/app.js',
    '/js/notes.js',
    '/js/editor.js',
    '/js/camera.js',
    '/js/speech.js',
    '/js/storage.js',
    '/js/settings.js',
    '/icons/icon-144x144.png',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.css',
    'https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
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
    // Handle POST requests (form submissions)
    if (event.request.method === 'POST') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.match(event.request);
            })
    );
});

// Handle push notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png'
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
                        icon: '/icons/icon-192x192.png',
                        badge: '/icons/icon-192x192.png',
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