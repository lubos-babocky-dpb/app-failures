import FailureReportsPage from "./pages/FailureReportsPage.vue";
import FailuresPage from "./pages/FailuresPage.vue";

export function registerModulePages(pageRouter) {
    pageRouter
        .registerPage({
            component: FailuresPage,
            guard: {
                requiredAnyPermission: ['page-access.failures']
            }
        })
        .registerPage({
            component: FailureReportsPage,
            guard: {
                requiredAnyPermission: ['page-access.failure-reports']
            }
        });
}