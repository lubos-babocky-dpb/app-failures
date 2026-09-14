export const UserEndpoints = {
    CREATE: {
        url: '/api/user-manager/v1/users',
        method: 'post'
    },
    READ: {
        url: '/api/user-manager/v1/users',
        method: 'GET',
    },
    UPDATE: {
        url: '/api/user-manager/v1/users',
        method: 'post'
    },
    DELETE: uuid => ({
        url: `/api/user-manager/v1/user/${uuid}`,
        method: 'delete'
    }),
};