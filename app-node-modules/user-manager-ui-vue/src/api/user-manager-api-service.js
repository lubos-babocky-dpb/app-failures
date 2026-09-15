import { UserEndpoints } from "./endpoints";

export class UserManagerApiService
{
    #apiClient;

    /**
     * 
     * @param {ApiClient} apiClient 
     */
    constructor(apiClient) {
        this.#apiClient = apiClient;
    }

    /** @returns {Promise<Response>} */
    getUsers() {
        return this.#apiClient.request(UserEndpoints.READ());
    }

    /**
     * @param {string} uuid 
     * @returns {Promise<Response>}
     */
    getUser(uuid) {
        return this.#apiClient.request(UserEndpoints.READ(uuid));
    }

    /**
     * 
     * @param {object} user 
     * @returns {Promise<Response>}
     */
    createUser(user) {
        return this.#apiClient.request(UserEndpoints.CREATE, {user});
    }

    /**
     * 
     * @param {string} userUuid 
     * @param {object} delta 
     * @returns {Promise<Response>}
     */
    updateUser(userUuid, delta) {
        return this.#apiClient.request(UserEndpoints.UPDATE(userUuid), {delta});
    }

    /**
     * 
     * @param {string} userUuid 
     * @returns {Promise<Response>}
     */
    deleteUser(userUuid) {
        return this.#apiClient.request(UserEndpoints.DELETE(userUuid));
    }
}