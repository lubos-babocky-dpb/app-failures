export class User
{
    constructor({
        uuid = crypto.randomUUID(),
        name,
        email,
        personalId,
        permissions = [],
    } = {}) {
        this.uuid = uuid;
        this.name = name;
        this.email = email;
        this.personalId = personalId;
        this.permissions = Array.isArray(permissions)
            ? [...permissions]
            : []
    }
}