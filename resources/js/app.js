import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { i18n } from './i18n';
import { initUserIdentity } from './userAuth'; // 1. Pridaný import
import { syncStaticData, syncPendingFailures } from './sync';

// Run initial synchronization routines on application bootstrap
initUserIdentity().then(() => { // 2. Obalenie štartu identitou
    syncStaticData().then(() => {
        // Attempt to upload any cached reports once registries are verified
        syncPendingFailures();
    });
});

// Register global network status listeners to auto-trigger syncing when connectivity resumes
window.addEventListener('online', () => {
    console.log('Network connectivity restored. Triggering upload sync...');
    syncPendingFailures();
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');