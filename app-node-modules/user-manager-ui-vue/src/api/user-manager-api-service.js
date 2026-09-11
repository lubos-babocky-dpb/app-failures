import { ApiClient } from '@dpb/app-base';
import { UserEndpoints } from "./endpoints";

export class UserManagerApiService {

    #apiClient;

    /**
     * @param {ApiClient} apiClient 
     */
    constructor({
        baseUrl = globalThis.location.origin,
        bearerToken = null,
        apiClient = new ApiClient({
            baseUrl: baseUrl,
            bearerToken: bearerToken
        })
    } = {}) {
        this.#apiClient = apiClient;
    }

    async getUsers() {
        return this.#apiClient.request(
            UserEndpoints.READ
        )
    }
}