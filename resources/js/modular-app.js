import { createApp } from "vue";
import App from "./modular/App.vue";
import { Gatekeeper } from "@dpb/gatekeeper";
import router from "./modular/router.js";
import { i18n } from "./modular/i18n.js";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import { ApiClient, PushSubscriptionService } from "@dpb/app-base";

window.Pusher = Pusher;
const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 80),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
    forceTLS: false,
    enabledTransports: ['ws'],
});

echo.channel("reportables")
    .listen(".reportables.changed", event => {
        console.log("REPORTABLES CHANGED:", event);
    });

// 1. Mount Vue application immediately
const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');

// 2. Asynchronous background registration (non-blocking)
async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    try {
        // Removed { type: 'module' } to support standard bundled SW scripts
        const registration = await navigator.serviceWorker.register('/modular-sw.js');
        const activeRegistration = await navigator.serviceWorker.ready;

        activeRegistration.active?.postMessage({ type: 'sync-initial-data' });

        if (!Gatekeeper.token) {
            console.warn('Push initialization skipped: Missing bearer token');
            return;
        }

        const apiClient = new ApiClient({
            baseUrl: globalThis.location.origin,
            bearerToken: Gatekeeper.token
        });

        const pushSubscriptionService = new PushSubscriptionService({
            vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
            apiClient: apiClient
        });

        const subscription = await pushSubscriptionService.getOrCreateSubscription();
        console.log('Push subscription initialized:', subscription);
    } catch (error) {
        console.error('Push/ServiceWorker initialization failed:', error);
    }
}

registerServiceWorker();