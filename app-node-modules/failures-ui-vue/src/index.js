import { db } from "./db";

import { failureCategoriesRepository } from "./repositories/failure-categories-repository";
import { failureReportsRepository } from "./repositories/failure-reports-repository";
import { failureTypesRepository } from "./repositories/failure-types-repository";
import { reportableAssetsRepository } from "./repositories/reportable-assets-repository";
import { FailuresApiService } from "./api/failures-api-service";

class FailuresUiVue
{
    #api = null;

    async initialize({baseUrl = '/', bearerToken = null} = {})
    {
        await db.open();
        this.#api = new FailuresApiService({
            baseUrl: baseUrl,
            bearerToken: bearerToken
        });
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
        return this.#api;
    }

    async createFailureReport(failureReport) {
        this.failureReportsRepository.save(failureReport);
        this.api.createFailureReport(failureReport);
    }
}

export const failuresUiVue = new FailuresUiVue();
export { FailureCategory } from './models/failure-category';
export { FailureType } from './models/failure-type';
export { FailureReport } from './models/failure-report';
export { ReportableAsset } from './models/reportable-asset';