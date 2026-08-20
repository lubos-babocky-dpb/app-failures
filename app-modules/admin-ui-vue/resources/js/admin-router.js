import { Gatekeeper } from '@dpb/gatekeeper';
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './pages/LoginPage.vue';
import DashboardPage from './pages/DashboardPage.vue';
import './services/admin-modules.js';
import admin from './services/admin-registry.js';

const router = createRouter({
    history: createWebHistory('/admin/'),

    routes: [
        {
            path: '/login',
            name: 'admin.login',
            component: LoginPage,
        },
        {
            path: '/',
            name: 'admin.dashboard',
            component: DashboardPage,
        },
        ...admin.getRoutes(),
    ],
});

router.beforeEach((to) => {

    if (to.name !== 'admin.login' && !Gatekeeper.hasAdminPrivileges) {
        return {
            name: 'admin.login',
        };
    }

    if (to.name === 'admin.login' && Gatekeeper.hasAdminPrivileges) {
        return {
            name: 'admin.dashboard',
        };
    }
});

export default router;