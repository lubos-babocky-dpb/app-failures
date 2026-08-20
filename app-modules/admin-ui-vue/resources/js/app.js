import { Gatekeeper } from '@dpb/gatekeeper';
import { createApp } from 'vue';
import App from './App.vue';
import router from './admin-router.js';

createApp(App)
    .use(router)
    .mount('#admin');