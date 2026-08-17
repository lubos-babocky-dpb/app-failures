export default class User {
    constructor({
        id,
        name,
        email,
        personal_id,
        roles = [],
    }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.personalId = personal_id;
        this.roles = roles;
    }

    hasRole(role) {
        return this.roles.includes(role);
    }

    hasAnyRole(roles) {
        return roles.some(role => this.hasRole(role));
    }

    get isAdmin() {
        return this.hasAnyRole(['admin', 'superadmin']);
    }

    get isSuperAdmin() {
        return this.hasRole('superadmin');
    }
}