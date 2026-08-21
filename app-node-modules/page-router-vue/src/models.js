export class Identity {
    #roles;
    #permissions;

    constructor(
        roles = [],
        permissions = []
    ) {
        this.#roles = roles;
        this.#permissions = permissions
    }

    updateIdentity(
        roles = [],
        permissions = []
    ) {
        this.#roles = roles;
        this.#permissions = permissions;
    }

    hasRole(role) {
        return this.#roles.includes(role);
    }

    hasPermission(permission) {
        return this.#permissions.includes(permission);
    }
}