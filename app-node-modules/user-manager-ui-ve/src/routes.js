import UserManager from "./pages/UserManager.vue";

export function registerModulePages(pageRouter) {
    pageRouter.registerPage({
        component: UserManager,
        guard: {
            requiredAnyPermission: ['page-access.user-management']
        }
    });
}