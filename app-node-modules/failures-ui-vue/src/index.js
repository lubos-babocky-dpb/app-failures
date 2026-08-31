import { db } from "./db";
import { failuresApiService } from "./api/failures-api-service";
import { failureCategoriesRepository } from "./repositories/failure-categories-repository";
import { failureReportsRepository } from "./repositories/failure-reports-repository";
import { failureTypesRepository } from "./repositories/failure-types-repository";
import { reportableAssetsRepository } from "./repositories/reportable-assets-repository";
import { FailureCategory } from "./models/failure-category";
import { FailureType } from "./models/failure-type";
import { FailureReport } from "./models/failure-report";
import { ReportableAsset } from "./models/reportable-asset";

class FailuresUiVue
{
    async initialize()
    {
        await db.open();
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
        return failuresApiService;
    }
}

export const failuresUiVue = new FailuresUiVue();
export { FailureCategory } from './models/failure-category';
export { FailureType } from './models/failure-type';
export { FailureReport } from './models/failure-report';
export { ReportableAsset } from './models/reportable-asset';