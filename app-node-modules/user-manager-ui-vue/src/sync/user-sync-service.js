import { userManagerDb } from '../db';
export class UserSyncService
{
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
}