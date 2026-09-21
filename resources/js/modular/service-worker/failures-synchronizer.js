import { FailuresUiVue } from "@dpb/failures-ui-vue";
import { FailuresApiService } from "../api/failures-api-service";
import { Gatekeeper } from "@dpb/gatekeeper";

export class FailuresSynchronizer
{
    #apiService;
    #failuresUiVue;

    constructor(bearerToken) {
        console.warn('FailuresSynchronizer.construct() !!!');
        this.#apiService = new FailuresApiService({
            bearerToken: bearerToken
        });
        this.#failuresUiVue = new FailuresUiVue(Gatekeeper.apiClient);
    }

    async syncReportableAssets() {
        const reportableAssets = await this.#apiService.getReportableAssets();
        await this.#failuresUiVue.initialize();
        await this.#failuresUiVue.reportableAssetsRepository.replaceAll(reportableAssets);
        return reportableAssets;
    }

    async syncFailureTypes() {
        const failureTypes = await this.#apiService.getFailureTypes();
        await this.#failuresUiVue.initialize();
        await this.#failuresUiVue.failureTypesRepository.replaceAll(failureTypes);
        return failureTypes;
    }

    async syncFailureCategories() {
        const failureCategories = await this.#apiService.getFailureCategories();
        await this.#failuresUiVue.initialize();
        await this.#failuresUiVue.failureCategoriesRepository.replaceAll(failureCategories);
        return failureCategories;
    }

    async syncFailureReports() {
        const failureReports = await this.#apiService.getFailureReports();
        await this.#failuresUiVue.initialize();
        await this.#failuresUiVue.failureReportsRepository.replaceAll(failureReports);
        return failureReports;
    }
}