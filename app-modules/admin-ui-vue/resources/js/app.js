import { createApp } from 'vue';
import App from './App.vue';
import router from './admin-router.js';
import { initialize } from './services/auth.js';

await initialize();

createApp(App)
    .use(router)
    .mount('#admin');