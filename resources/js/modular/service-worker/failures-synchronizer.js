import { failuresUiVue } from "../../../../app-node-modules/failures-ui-vue/src";
import { FailuresApiService } from "../api/failures-api-service";

export class FailuresSynchronizer
{
    #apiService;

    constructor(bearerToken) {
        this.#apiService = new FailuresApiService({
            bearerToken: bearerToken
        });
    }

    async syncReportableAssets() {
        const reportableAssets = await this.#apiService.getReportableAssets();
        await failuresUiVue.initialize();
        await failuresUiVue.reportableAssetsRepository.replaceAll(reportableAssets);
        console.log('syncing reportable assets', reportableAssets);
        return reportableAssets;
    }

    async syncFailureTypes() {
        const failureTypes = await this.#apiService.getFailureTypes();
        await failuresUiVue.initialize();
        await failuresUiVue.failureTypesRepository.replaceAll(failureTypes);
        console.log('syncing failure types', failureTypes);
        return failureTypes;
    }

    async syncFailureCategories() {
        const failureCategories = await this.#apiService.getFailureCategories();
        await failuresUiVue.initialize();
        await failuresUiVue.failureCategoriesRepository.replaceAll(failureCategories);
        console.log('syncing failure categories', failureCategories);
        return failureCategories;
    }

    async syncFailureReports() {
        const failureReports = await this.#apiService.getFailureReports();
        await failuresUiVue.initialize();
        await failuresUiVue.failureReportsRepository.replaceAll(failureReports);
        console.log('syncing failure reports', failureReports);
        return failureReports;
    }
}