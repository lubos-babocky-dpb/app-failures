import { createApp } from "vue";
import App from "./modular/App.vue";
import { Gatekeeper } from "@dpb/gatekeeper";
import router from "./modular/router.js";
import { i18n } from "./modular/i18n.js";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import { failuresUiVue } from "@dpb/failures-ui-vue";
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

Gatekeeper.setBaseUrl('/');

if ('serviceWorker' in navigator) {
    try {
        await navigator.serviceWorker.register('/modular-sw.js', { type: 'module' });

        const apiClient = new ApiClient({
            baseUrl: '',
            bearerToken: Gatekeeper.token
        });

        const pushSubscriptionService = new PushSubscriptionService({
            vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
            apiClient: apiClient
        });
        const subscription = await pushSubscriptionService.getOrCreateSubscription();
        console.log('Push subscription:', subscription);
    } catch (error) {
        console.error('Push initialization failed', error);
    }
}

await failuresUiVue.initialize();

createApp(App)
    .use(router)
    .use(i18n)
    .mount('#app');