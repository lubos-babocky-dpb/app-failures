import { createRouter, createWebHistory } from "vue-router";
import { Identity } from "../models";

class PageRouter {
    #routes = [];
    #menuItems = [];
    #globalGuard = null;
    #router;
    #identity = new Identity();

    constructor() {
        const modules = import.meta.glob(
            '/app-node-modules/*/src/routes.js',
            {eager: true}
        );

        for (const module of Object.values(modules)) {
            if (typeof module.registerModulePages === 'function') {
                module.registerModulePages(this);
            }
        }
    }

    createRouter(options) {
        this.#router = createRouter({
            history: createWebHistory(options.base),
            routes: [
                ...this.#routes,
            ],
        });
        this.#registerGuards();
        return this.#router;
    }

    updateIdentity(
        roles = [],
        permissions = []
    ) {
        this.#identity.updateIdentity(roles, permissions);
    }

    registerInvisiblePage({component, route = null, guard = null}) {
        this.#routes.push({
            path: route?.path ?? this.#createRoutePathFromComponent(component),
            name: route?.name ?? this.#createRouteNameFromComponent(component),
            component,
            meta: {
                guard: guard ?? null
            }
        });
        return this;
    }

    registerDefaultPage({component, route = null, menu = null, guard = null}) {
        return this.registerPage({
            component: component,
            route: route ?? { path: '/' },
            menu: menu ?? {},
            guard: guard
        });
    }

    registerPage({component, route = null, menu = {}, guard = null}) {
        this.#routes.push({
            path: route?.path ?? this.#createRoutePathFromComponent(component),
            name: route?.name ?? this.#createRouteNameFromComponent(component),
            component: component,
            meta: {
                guard: guard ?? null
            }
        });

        this.#menuItems.push({
            label: menu.label ?? this.#createRouteLabelFromComponent(component),
            route: route?.name ?? this.#createRouteNameFromComponent(component),
            guard: guard ?? null,
            position: menu.position ?? 10 * this.#menuItems.length
        });
        return this;
    }

    get routes() {
        return [...this.#routes];
    }

    get menuItems() {
        if(!this.#isAllowed(this.#globalGuard)) {
            return [];
        }

        return  this.#menuItems
            .filter(item => this.#isAllowed(item.guard))
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
        if (!guardConfig || guardConfig.isPublic) {
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

    #registerGuards() {
        this.#router.beforeEach((to) => {
            const guardConfig = to.meta.guard;
            if (!guardConfig?.ignoreGlobalGuard) {
                if (!this.#isAllowed(this.#globalGuard)) {
                    return false;
                }
            }
            return this.#isAllowed(guardConfig);
        });
    }

    #createRouteLabelFromComponent(component) {
        if (component.__name) {
            return component.__name
                .replace(/Page$/, '')
                .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
                .toLowerCase();
        }

        if (component.__file) {
            const marker = '/pages/';
            const position = component.__file.indexOf(marker);

            if (position === -1) {
                return null;
            }

            return component.__file
                .substring(position + marker.length)
                .replace(/\.vue$/, '')
                .replace(/Page$/, '')
                .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
                .toLowerCase();
        }

        return null;
    }

    #createRouteNameFromComponent(component) {
        return this.#createRouteLabelFromComponent(component).toLowerCase();
    }

    #createRoutePathFromComponent(component) {
        return `/${this.#createRouteNameFromComponent(component)}`;
    }
}

const pageRouter = new PageRouter();

export {
    pageRouter as PageRouter
};