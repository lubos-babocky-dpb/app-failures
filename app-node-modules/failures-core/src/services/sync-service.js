import { ApiService } from "../api/api-service";
import { ReportableAssetSynchronizer } from "../domain/reportable-asset/reportable-asset-synchronizer";

export class SyncService
{
    #apiService;
    #database;
    #reportableAssetSynchronizer;

    constructor(apiClient, database) {
        this.#apiService = new ApiService(apiClient);
        this.#database = database;
        this.#reportableAssetSynchronizer = new ReportableAssetSynchronizer(
            this.#apiService,
            this.#database
        );
    }

    get reportableAssetSynchronizer() {
        return this.#reportableAssetSynchronizer;
    }
}