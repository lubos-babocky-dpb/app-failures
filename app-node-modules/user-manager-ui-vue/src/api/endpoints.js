/**
 * @typedef {Object} ApiEndpoint
 * @property {string} url
 * @property {string} method
 */

export const UserEndpoints = {
    /** @type {ApiEndpoint} */
    CREATE: {
        url: '/api/user-manager/v1/user',
        method: 'POST'
    },

    /**
     * @param {string} [uuid]
     * @returns {ApiEndpoint}
     */
    READ: (uuid = '') => ({
        url: '/api/user-manager/v1/user' + (uuid ? `/${uuid}` : ''),
        method: 'GET',
    }),

    /**
     * @param {string} uuid
     * @returns {ApiEndpoint}
     */
    UPDATE: uuid => ({
        url: `/api/user-manager/v1/user/${uuid}`,
        method: 'PATCH'
    }),

    /**
     * @param {string} uuid
     * @returns {ApiEndpoint}
     */
    DELETE: uuid => ({
        url: `/api/user-manager/v1/user/${uuid}`,
        method: 'DELETE'
    }),
};