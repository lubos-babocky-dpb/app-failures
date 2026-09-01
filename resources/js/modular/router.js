import { createRouter, createWebHistory } from "vue-router";
import UserInfoPage from "./Pages/UserInfoPage.vue";
import DebugPage from "./Pages/DebugPage.vue";
import ReportableAssetsPage from "./Pages/ReportableAssetsPage.vue";
import CreateFailureReport from "./Pages/CreateFailureReport.vue";
import FailureReportsHistory from "./Pages/FailureReportsHistory.vue";

const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        {
            path: '/',
            component: CreateFailureReport,
            meta: {
                labelKey: 'nav.new_report',
                icon: 'M12 4v16m8-8H4',
                isMenuItem: true,
            },
        },
        {
            path: '/history',
            component: FailureReportsHistory,
            meta: {
                labelKey: 'nav.history',
                icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                isMenuItem: true,
            },
        },
        {
            path: '/history/:uuid',
            component: FailureReportsHistory,
            meta: {
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