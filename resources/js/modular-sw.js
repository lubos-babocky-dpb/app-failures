import { precacheAndRoute } from 'workbox-precaching';
import { AppServiceWorker } from './app-service-worker';


precacheAndRoute(self.__WB_MANIFEST);

new AppServiceWorker();


/*
const serviceWorker = new FailuresServiceWorker();

self.addEventListener('install', event => {
    event.waitUntil(serviceWorker.initialize());

    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});
/**/