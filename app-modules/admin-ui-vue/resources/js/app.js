import { Gatekeeper, IdentityUpdatedEvent } from '@dpb/gatekeeper';
import { PageRouter } from '@dpb/page-router-vue';
import { createApp } from 'vue';
import App from './App.vue';
import DashboardPage from './pages/DashboardPage.vue';
import LoginPage from './pages/LoginPage.vue';

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