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
    '/icons/icon.svg',
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

// Fetch Event Handler with Cache First, falling back to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // Return cached version if available
                }
                return fetch(event.request)
                    .then(response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Add it to cache
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
            .catch(() => {
                // If both cache and network fail, return offline page
                if (event.request.mode === 'navigate') {
                    return caches.match('/');
                }
                return new Response('Offline content not available');
            })
    );
});

// Handle push notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        icon: '/icons/icon.svg',
        badge: '/icons/icon.svg'
    };

    event.waitUntil(
        self.registration.showNotification('OfflineNoteKeeper', options)
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
                        icon: '/icons/icon.svg',
                        badge: '/icons/icon.svg',
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
