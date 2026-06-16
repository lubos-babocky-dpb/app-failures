// public/sw.js

// 1. Zachytenie push notifikácie a jej zobrazenie
self.addEventListener('push', function (event) {
    if (!event.data) return;

    try {
        const data = event.data.json();
        const options = data.notification;

        event.waitUntil(
            self.registration.showNotification(options.title, options)
        );
    } catch (e) {
        console.error('Chyba pri push notifikácii:', e);
    }
});

// 2. Čo sa stane, keď na ňu klikne
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const targetUrl = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            for (const client of clientList) {
                if (client.url.includes(targetUrl) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) return clients.openWindow(targetUrl);
        })
    );
});