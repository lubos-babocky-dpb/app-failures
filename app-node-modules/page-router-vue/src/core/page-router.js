import { createRouter, createWebHistory } from "vue-router";
import { Identity } from "../models";

class PageRouter {
    #routes = [];
    #menuItems = [];
    #globalGuard = null;
    #router;
    #identity = new Identity();
    #defaultAccess = 'authenticated';

    constructor() {
        const modules = import.meta.glob(
            [
                '/**/src/pages/**/*.vue',
                '/**/js/pages/**/*.vue'
            ],
            { eager: true }
        );

        for (const module of Object.values(modules)) {
            if(module.default?.router?.pageName) {
                const routePath = this.#buildRoutePathFromComponent(module.default);
                if(!this.#routes?.some(route => route.path === routePath)) {
                    this.registerPage(module.default);
                }
            }
        }
    }

    createRouter({
        baseUrl = '/',
        startPages = [],
        defaultAccess = 'authenticated'
    } = {}) {
        this.#defaultAccess = defaultAccess;

        const startPage = startPages.find(
            component => this.#hasAccess(
                component.router?.access ?? this.#defaultAccess
            )
        );

        if (!startPage) {
            throw new Error('No accessible start page found');
        }

        this.registerStartPage(startPage);


        this.#router = createRouter({
            history: createWebHistory(baseUrl),
            routes: [
                ...this.#routes,
                // [L:] fallback
                {path: '/:pathMatch(.*)*', redirect: '/'}
            ],
        });

        this.#registerGuards();
        return this.#router;
    }

    registerPage(component) {
        this.#routes.push({
            path: this.#buildRoutePathFromComponent(component),
            name: this.#buildRouteNameFromComponent(component),
            component: component
        });

        if (!component.router?.hideInMenu) {
            this.#menuItems.push({
                label: this.#buildRouteLabelFromComponent(component),
                route: this.#buildRouteNameFromComponent(component),
                access: component.router.access ?? null,
                guard: component.router.guard ?? null,
                position: component.router?.menuPosition ?? 10 * this.#menuItems.length
            });
        }

        return this;
    }

    registerStartPage(component) {
        const route = this.#routes.find(
            route => route.name === this.#buildRouteNameFromComponent(component)
        );

        if (!route) {
            throw new Error('Start page is not registered');
        }

        route.path = `/`;
    }

    #buildRoutePathFromComponent(component) {
        const routePath = this.#convertString(
            component.router?.path ?? component.router.pageName
        );
        return `/${routePath}`;
    }

    #buildRouteNameFromComponent(component) {
        return this.#convertString(
            component.router?.name ?? component.router.pageName
        );

    }

    #buildRouteLabelFromComponent(component) {
        return component.router?.label ?? component.router.pageName;
    }

    #convertString(inputString) {
        return inputString
            .replace(/^\/+/, '')
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
            .toLowerCase();
    }

    updateIdentity(user) {
        this.#identity.updateIdentity(user);
    }

    get routes() {
        return [...this.#routes];
    }

    get menuItems() {
        if(!this.#isAllowed(this.#globalGuard)) {
            return [];
        }

        return  this.#menuItems
            .filter(item =>
                this.#hasAccess(item.access ?? this.#defaultAccess) &&
                this.#isAllowed(item.guard)
            )
            .sort((a, b) => a.position - b.position)
            .map(item => ({ ...item }));
    }

    redirect(component) {
        const route = this.routes.find(route => route.component === component);
        if(!route) {
            throw new Error('Page is not registered');
        }
        return this.#router.replace({ name: route.name });
    }

    registerGlobalGuard(globalGuard) {
        this.#globalGuard = globalGuard;
        return this;
    }

    #isAllowed(guardConfig) {
        if (!guardConfig) {
            return true;
        }

        if(guardConfig.allowedRoles && guardConfig.allowedRoles.some(
            role => this.#identity.hasRole(role)
        )) {
            return true;
        }

        if(guardConfig.requiredAnyPermission && guardConfig.requiredAnyPermission.some(
            permission => this.#identity.hasPermission(permission)
        )) {
            return true;
        }

        return false;
    }

    #hasAccess(access) {
        if (access === 'authenticated') {
            return this.#identity.isAuthenticated();
        }

        if (access === 'anonymous') {
            return !this.#identity.isAuthenticated();
        }

        return false;
    }

    #registerGuards() {
        this.#router.beforeEach((to) => {
            const routerConfig = this.#loadComponent(to.name)?.router;

            const access = routerConfig?.access ?? this.#defaultAccess;

            if (!this.#hasAccess(access)) {
                return { path: '/' };
            }

            if (!this.#isAllowed(routerConfig?.guard)) {
                return { path: '/' };
            }

            return true;
        });
    }

    #loadComponent(routeName) {
        return this.#routes.find(route => route.name === routeName)?.component;
    }
}

const pageRouter = new PageRouter();

export {
    pageRouter as PageRouter
};