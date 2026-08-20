import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: () => import('./Pages/NewReport.vue') },
        { path: '/history', component: () => import('./Pages/FailureHistory.vue') },
        { path: '/history/detail/:uuid', component: () => import('./Pages/FailureDetail.vue') }
    ]
});

export default router;