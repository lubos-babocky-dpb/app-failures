import { createRouter, createWebHistory } from "vue-router";
import UserInfoPage from "./Pages/UserInfoPage.vue";
import DebugPage from "./Pages/DebugPage.vue";
import ReportPage from "./Pages/ReportPage.vue";
import ReportableAssetsPage from "./Pages/ReportableAssetsPage.vue";

const router = createRouter({
    history: createWebHistory('/'),
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
        {
            path: '/reportables',
            component: ReportableAssetsPage,
            meta: {
                labelKey: 'nav.reportables',
                icon: null,
                isMenuItem: true
            },
        },
        {
            path: '/new-form',
            component: ReportPage,
            meta: {
                labelKey: 'nav.new-form',
                icon: null,
                isMenuItem: true
            },
        },
        {
            path: '/user-info',
            component: UserInfoPage,
            meta: {
                labelKey: 'nav.user_info',
                icon: null,
                isMenuItem: true
            },
        },
        {
            path: '/debug',
            component: DebugPage,
            meta: {
                labelKey: 'nav.debug',
                icon: null,
                isMenuItem: true
            },
        },
    ],
});

export default router;