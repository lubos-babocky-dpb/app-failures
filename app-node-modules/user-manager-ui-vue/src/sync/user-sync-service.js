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
            const users = await this.#apiService.getUsers();
            await userManagerDb.users.clear();
            await userManagerDb.users.bulkPut(users);
        } catch(ex) {
            console.error(ex);
        }
    }

    async create(modelUuid, delta) {
        console.log(`Create user ${modelUuid}`);
    }

    async update(modelUuid, delta) {
        console.log(`Update user ${modelUuid}`);
    }

    async delete(modelUuid) {
        return await this.#apiService.deleteUser(modelUuid);
    }
}