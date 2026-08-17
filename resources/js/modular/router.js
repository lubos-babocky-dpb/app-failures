import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory('/pwa-new/'),
    routes: [
        {
            path: '/',
            component: () => import('./Pages/NewReport.vue'),
            meta: {
                labelKey: 'nav.new_report',
                icon: 'M12 4v16m8-8H4',
                isMenuItem: true,
            },
        },
        {
            path: '/history',
            component: () => import('./Pages/FailureHistory.vue'),
            meta: {
                labelKey: 'nav.history',
                icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                isMenuItem: true,
            },
        },
        {
            path: '/history/detail/:uuid',
            component: () => import('./Pages/FailureDetail.vue'),
            meta: {
                labelKey: 'nav.failure_detail',
                icon: null,
                isMenuItem: false
            },
        },
    ],
});

export default router;