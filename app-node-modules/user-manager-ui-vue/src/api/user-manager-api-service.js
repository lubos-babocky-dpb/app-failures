import { ApiClient } from '@dpb/app-base';
import { UserEndpoints } from "./endpoints";

export class UserManagerApiService {

    #apiClient;

    /**
     * @param {ApiClient} apiClient 
     */
    constructor(apiClient) {
        this.#apiClient = apiClient;
    }

    async getUsers() {
        return this.#apiClient.request(
            UserEndpoints.READ
        );
    }

    async deleteUser(userUuid) {
        try {
            console.log(`UserManagerApiService -> deleteUser(${userUuid})`, UserEndpoints.DELETE(userUuid));
            const response = await this.#apiClient.request(
                UserEndpoints.DELETE(userUuid)
            );
            console.log('Response: ', response);
            return response;
        } catch(error) {
            console.error(error);
        }
    }
}