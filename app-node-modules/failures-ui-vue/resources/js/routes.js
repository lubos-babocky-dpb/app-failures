import FailureReportsPage from "./pages/FailureReportsPage.vue";
import FailuresPage from "./pages/FailuresPage.vue";

export function registerModulePages(pageRouter) {
    pageRouter
        .registerPage({component: FailuresPage})
        .registerPage({component: FailureReportsPage});
}