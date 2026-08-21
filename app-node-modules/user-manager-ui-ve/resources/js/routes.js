import UserManagement from './pages/UserManagement.vue';

export function registerModulePages(pageRouter) {
    pageRouter.registerPage({component: UserManagement});
}