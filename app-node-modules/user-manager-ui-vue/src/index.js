import { UserManagerApiService } from "./api/user-manager-api-service";
import { UserSyncService } from "./sync/user-sync-service";

export class UserManager
{
    #apiService;
    #userSyncService;

    constructor(apiClient) {
        this.#apiService = new UserManagerApiService(apiClient);
        this.#userSyncService = new UserSyncService(this.#apiService);
    }

    get userSyncService() {
        return this.#userSyncService;
    }
}