import { precacheAndRoute } from 'workbox-precaching';

import { FailuresServiceWorker } from './modular/service-worker/failures-service-worker';

precacheAndRoute(self.__WB_MANIFEST);

const serviceWorker = new FailuresServiceWorker();

self.addEventListener('install', event => {
    event.waitUntil(serviceWorker.initialize());

    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});
