import { createApp } from "vue";
import App from "./modular/App.vue";
import { Gatekeeper } from "@dpb/gatekeeper";
import router from "./modular/router.js";
import { i18n } from "./modular/i18n.js";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import { failuresUiVue } from "../../app-node-modules/failures-ui-vue/src/index.js";


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

Gatekeeper.setBaseUrl('http://localhost/');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/modular-sw.js', { type: 'module' })
//        .then(registration => { console.log('SW registered:', registration); })
        .catch(error => { console.error('SW registration failed:', error); });
}

await failuresUiVue.initialize();

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');