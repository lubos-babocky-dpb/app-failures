export class Identity {
    #user;

    constructor(user) {
        this.updateIdentity(user);
    }

    updateIdentity(user = null) {
        this.#user = user;
    }

    isAuthenticated() {
        return this.#user !== null;
    }

    hasRole(role) {
        return this.#user?.privileges?.roles?.includes(role) ?? false;
    }

    hasPermission(permission) {
        return this.#user?.privileges?.permissions?.includes(permission) ?? false;
    }
}