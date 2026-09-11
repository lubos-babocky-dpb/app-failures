import { Gatekeeper, IdentityUpdatedEvent } from '@dpb/gatekeeper';
import { PageRouter } from '@dpb/page-router-vue';
import { createApp } from 'vue';
import App from './App.vue';
import DashboardPage from './pages/DashboardPage.vue';
import LoginPage from './pages/LoginPage.vue';
import { ApiClient, PushSubscriptionService } from "@dpb/app-base";

Gatekeeper.setBaseUrl('/');

if ('serviceWorker' in navigator) {
    try {
        await navigator.serviceWorker.register('/modular-sw.js', { type: 'module' });
        const registration = await navigator.serviceWorker.ready;
        registration.active.postMessage({type: 'sync-initial-data'});
        registration.active.postMessage({type: 'sync-user-manager-data'});
        const apiClient = new ApiClient({baseUrl: import.meta.env.APP_URL, bearerToken: Gatekeeper.token});
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

function updatePageRouterIdentity(identity) {
    PageRouter.updateIdentity(identity.user);
};

updatePageRouterIdentity(Gatekeeper.identity);

Gatekeeper.addEventListener(IdentityUpdatedEvent.TYPE, (event) => {
    updatePageRouterIdentity(event.identity);
});

createApp(App)
    .use(PageRouter.createRouter({
        baseUrl: 'admin',
        startPages: [
            LoginPage,
            DashboardPage,
        ],
        defaultAccess: 'authenticated'
    }))
    .mount('#admin');