import { failuresUiVue } from "@dpb/failures-ui-vue";
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
        return reportableAssets;
    }

    async syncFailureTypes() {
        const failureTypes = await this.#apiService.getFailureTypes();
        await failuresUiVue.initialize();
        await failuresUiVue.failureTypesRepository.replaceAll(failureTypes);
        return failureTypes;
    }

    async syncFailureCategories() {
        const failureCategories = await this.#apiService.getFailureCategories();
        await failuresUiVue.initialize();
        await failuresUiVue.failureCategoriesRepository.replaceAll(failureCategories);
        return failureCategories;
    }

    async syncFailureReports() {
        const failureReports = await this.#apiService.getFailureReports();
        await failuresUiVue.initialize();
        await failuresUiVue.failureReportsRepository.replaceAll(failureReports);
        return failureReports;
    }
}