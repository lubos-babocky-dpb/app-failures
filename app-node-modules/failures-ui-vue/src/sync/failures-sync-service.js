import { FailuresApiService } from '../api/failures-api-service';

export class FailuresSyncService
{
    /** @type {FailuresApiService} */
    #apiService;

    constructor(apiService) {
        this.#apiService = apiService;
    }

    async syncAllFromApi() {
        try {
            const failureCategoriesResponse = await this.#apiService.getFailureCategories();
            const failureTypesResponse = await this.#apiService.getFailureTypes();
            const failureReportsResponse = await this.#apiService.getFailureReports();
            const reportableAssetsResponse = await this.#apiService.getReportableAssets();
        } catch(ex) {
            console.error('FailuresSyncService.syncAllFromApi()', ex);
        }
    }
}