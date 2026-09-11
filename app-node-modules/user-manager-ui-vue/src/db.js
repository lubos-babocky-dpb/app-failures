import Dexie from 'dexie';
export const db = new Dexie('DPB_UserManager');

db.version(1).stores({
    users: 'uuid',
    roles: 'uuid',
    permissions: 'uuid'
});

export const userManagerDb = Object.freeze({
    users: db.users,
    roles: db.roles,
    permissions: db.permissions
});