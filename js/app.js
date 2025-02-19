// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        })
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// Initialize Feather Icons
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();

    // Check and apply theme
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }

    // Request notification permission
    if ('Notification' in window) {
        Notification.requestPermission();
    }
});

// Check for app updates
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        // New service worker activated
        window.location.reload();
    });
}

// Handle PWA installation
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show install button or prompt if needed
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.style.display = 'block';
        installBtn.addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                deferredPrompt = null;
            });
        });
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    showToast('You are back online!', 'success');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    showToast('You are offline. Changes will be saved locally.', 'warning');
});

// Utility function to show toast messages
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast show position-fixed bottom-0 end-0 m-3 bg-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="toast-body text-white">
            ${message}
        </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}