import { ApiClient } from '@dpb/app-base-vue/api/ApiClient';
import { UserEndpoints } from "./endpoints";

export class UserManagerApiService {

    #apiClient;

    /**
     * @param {ApiClient} apiClient 
     */
    constructor({
        baseUrl = '',
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