import FailuresPage from "./pages/FailuresPage.vue";

export function register(admin) {
    admin.registerRoute({
        path: '/failures',
        name: 'admin.failures',
        component: FailuresPage,
    });

    admin.registerMenuItem({
        label: 'Poruchy',
        route: 'admin.failures'
    });
}