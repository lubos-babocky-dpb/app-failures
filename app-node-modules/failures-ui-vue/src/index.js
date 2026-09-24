import { failureCategoriesRepository } from "./repositories/failure-categories-repository";
import { failureReportsRepository } from "./repositories/failure-reports-repository";
import { failureTypesRepository } from "./repositories/failure-types-repository";
import { reportableAssetsRepository } from "./repositories/reportable-assets-repository";
import { FailuresApiService } from "./api/failures-api-service";
import { FailuresSyncService } from "./sync/failures-sync-service";

export class FailuresUiVue
{
    #apiService = null;
    #syncService = null;

    constructor(apiClient) {
        console.warn('FailuresUiVue still in use!!!');
        this.#apiService = new FailuresApiService(apiClient);
        this.#syncService = new FailuresSyncService(this.#apiService);
    }

    async initialize({baseUrl = '/', bearerToken = null} = {})
    {
        console.warn('FailuresUiVue.initialize still called!');
    }

    get failureCategoriesRepository() {
        return failureCategoriesRepository;
    }

    get failureTypesRepository() {
        return failureTypesRepository;
    }

    get failureReportsRepository() {
        return failureReportsRepository;
    }

    get reportableAssetsRepository() {
        return reportableAssetsRepository;
    }

    get api() {
        return this.#apiService;
    }

    get syncService() {
        return this.#syncService;
    }

    async createFailureReport(failureReport) {
        this.failureReportsRepository.save(failureReport);
        this.api.createFailureReport(failureReport);
    }
}

export { FailureCategory } from './models/failure-category';
export { FailureType } from './models/failure-type';
export { FailureReport } from './models/failure-report';
export { ReportableAsset } from './models/reportable-asset';