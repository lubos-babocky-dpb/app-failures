import { Gatekeeper, IdentityUpdatedEvent } from '@dpb/gatekeeper';
import { PageRouter } from '@dpb/page-router-vue';
import { createApp } from 'vue';
import App from './App.vue';
import DashboardPage from './pages/DashboardPage.vue';
import LoginPage from './pages/LoginPage.vue';
import RestrictedPage from './pages/RestrictedPage.vue';

PageRouter
    .registerGlobalGuard({allowedRoles: ['admin']})
    .registerDefaultPage({component: DashboardPage, menu: {position: 1}, guard: { allowedRoles: ['admin']}})
    .registerPage({component: RestrictedPage, menu: {}, guard: { allowedRoles: ['lol']}})
    .registerInvisiblePage({component: LoginPage, guard: {ignoreGlobalGuard: true}});

function updatePageRouterIdentity(identity) {
    PageRouter.updateIdentity(
        identity.user?.privileges?.roles ?? [],
        identity.user?.privileges?.permissions ?? [],
    );
}

updatePageRouterIdentity(Gatekeeper.identity);

Gatekeeper.addEventListener(IdentityUpdatedEvent.TYPE, (event) => {
    updatePageRouterIdentity(event.identity);
});

const router = PageRouter.createRouter({ base: '/admin/'});

createApp(App)
    .use(router)
    .mount('#admin');