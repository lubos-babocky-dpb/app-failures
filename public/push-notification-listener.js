self.addEventListener('push', function (event) {
    if (!event.data) return;

    try {
        const data = event.data.json();
        const options = data.notification;

        event.waitUntil(
            self.registration.showNotification(options.title, options)
        );
    } catch (e) {
        console.error('Chyba pri spracovaní push dát:', e);
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    
    // 1. Vytiahneme relatívnu URL, ktorú sme poslali z Laravel Observera (/history/detail/{uuid})
    const relativeUrl = event.notification.data && event.notification.data.url 
        ? event.notification.data.url 
        : '/history';

    // 2. Preklopíme ju na absolútnu URL vzhľadom k doméne (spraví to http://localhost/history/detail/...)
    const targetUrl = new URL(relativeUrl, self.location.origin).href;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            // 3. Skontrolujeme, či už používateľ nemá tvoju appku otvorenú
            for (const client of clientList) {
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // 4. Ak appka nebola otvorená vôbec, alebo bol na inej podstránke, otvoríme nové okno s detailom poruchy
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});