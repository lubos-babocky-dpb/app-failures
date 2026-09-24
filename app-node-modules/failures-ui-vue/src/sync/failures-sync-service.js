import { FailuresApiService } from '../api/failures-api-service';
import { failureDb } from '../db';

export class FailuresSyncService
{
    /** @type {FailuresApiService} */
    #apiService;

    constructor(apiService) {
        this.#apiService = apiService;
    }

    async syncAllFromApi() {
        try {
            await Promise.all([
                this.syncFailureCategories(),
                this.syncFailureTypes(),
                this.syncFailureReports(),
                this.syncReportableAssets(),
            ]);
        } catch (ex) {
            console.error('FailuresSyncService.syncAllFromApi()', ex);
        }
    }

    async syncFailureCategories() {
        const response = await this.#apiService.getFailureCategories();
        const body = await response.json();
        await failureDb.failureCategories.clear();
        await failureDb.failureCategories.bulkPut(body.data);
    }

    async syncFailureTypes() {
        const response = await this.#apiService.getFailureTypes();
        const body = await response.json();
        await failureDb.failureTypes.clear();
        await failureDb.failureTypes.bulkPut(body.data);
    }

    async syncFailureReports() {
        const response = await this.#apiService.getFailureReports();
        const body = await response.json();
        await failureDb.failureReports.clear();
        await failureDb.failureReports.bulkPut(body.data);
    }

    async syncReportableAssets() {
        const response = await this.#apiService.getReportableAssets();
        const body = await response.json();
        await failureDb.reportableAssets.clear();
        await failureDb.reportableAssets.bulkPut(body.data);
    }
}