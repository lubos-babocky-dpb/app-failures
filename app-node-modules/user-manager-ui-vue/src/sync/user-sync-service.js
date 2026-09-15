import { UserManagerApiService } from '../api/user-manager-api-service';
import { userManagerDb } from '../db';
export class UserSyncService
{
    /** @type {UserManagerApiService} */
    #apiService;

    constructor(apiService) {
        this.#apiService = apiService;
    }

    async syncAllFromApi() {
        try {
            const response = await this.#apiService.getUsers();
            const users = await response.json();
            await userManagerDb.users.clear();
            await userManagerDb.users.bulkPut(users);
        } catch(ex) {
            console.error('syncAllFromApi', ex);
        }
    }

    /**
     * 
     * @param {string} modelUuid 
     * @param {object} delta 
     * @returns {boolean}
     */
    async create(modelUuid, delta) {
        const response = await this.#apiService.createUser(delta);
        if(response.status !== 201) {
            const message = (await response.json()).message;
            console.warn(`Error while creating user: ${message}`);
            return false;
        }
        return true;
    }

    async update(modelUuid, delta) {
        console.log(`Update user ${modelUuid}`);
    }

    /**
     * 
     * @param {string} uuid 
     * @returns {boolean}
     */
    async delete(uuid) {
        const response = await this.#apiService.deleteUser(uuid);
        return response.status === 200;
    }
}