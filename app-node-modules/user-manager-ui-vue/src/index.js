import { UserManagerApiService } from "./api/user-manager-api-service";
import { UserSyncService } from "./sync/user-sync-service";

export class UserManager
{
    #apiService;
    #userSyncService;

    constructor(bearerToken) {
        this.#apiService = new UserManagerApiService({ bearerToken: bearerToken });
        this.#userSyncService = new UserSyncService(this.#apiService);
    }

    get userSyncService() {
        return this.#userSyncService;
    }

    async syncAll() {
        const users = await this.#apiService.getUsers();
        console.log('Users: ', users);
    }
}