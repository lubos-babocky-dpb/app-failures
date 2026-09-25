import { Database } from "@dpb/app-base";
import { ApiService } from "./api/api-service";
import { ReportableAsset } from "./domain/reportable-asset/reportable-asset";
import { ReportableAssetRepository } from "./domain/reportable-asset/reportable-asset-repository";
import { ReportableAssetSynchronizer } from "./domain/reportable-asset/reportable-asset-synchronizer";
import { FailureType } from "./domain/failure-type/failure-type";
import { FailureTypeRepository } from "./domain/failure-type/failure-type-repository";
import { FailureCategory } from "./domain/failure-category/failure-category";
import { FailureCategoryRepository } from "./domain/failure-category/failure-category-repository";
import { FailureReportRepository } from "./domain/failure-report/failure-report-repository";

export { ReportableAsset } from "./domain/reportable-asset/reportable-asset";
export { FailureReport } from "./domain/failure-report/failure-report";

class FailuresDatabase
{
    #dbPromise;

    constructor() {
        this.#dbPromise = new Database('DPB_Failures')
            .createTable('reportableAssets', 'uuid')
            .createTable('failureCategories', 'uuid, parent_uuid')
            .createTable('failureTypes', 'uuid, category_uuid')
            .createTable('failureReports', 'uuid, reportable_id, category_id, status, created_at')
            .open();
    }

    /**
     * @returns {Promise<Object>}
     */
    async getConnection() {
        return await this.#dbPromise;
    }

    async table(name) {
        const db = await this.#dbPromise;
        return db.table(name);
    }
}

class FailuresModule
{
    #reportableAssetsRepository;
    #failureCategoryRepository;
    #failureTypeRepository;
    #failureReportRepository;

    constructor(
        database = new FailuresDatabase()
    ) {
        this.#reportableAssetsRepository = new ReportableAssetRepository(database.table('reportableAssets'));
        this.#failureCategoryRepository = new FailureCategoryRepository(database.table('failureCategories'));
        this.#failureTypeRepository = new FailureTypeRepository(database.table('failureTypes'));
        this.#failureReportRepository = new FailureReportRepository(database.table('failureReports'));
    }

    /**
     * @param {string} uuid
     * @returns {Promise<ReportableAsset|null>}
     */
    async findReportableAsset(uuid) {
        return await this.#reportableAssetsRepository.findByUuid(uuid);
    }

    /**
     * @param {string} uuid 
     * @returns {Promise<FailureType|null>}
     */
    async findFailureType(uuid) {
        return await this.#failureTypeRepository.findByUuid(uuid);
    }

    /**
     * @param {string} uuid 
     * @returns {Promise<FailureCategory>}
     */
    async findFailureCategory(uuid) {
        return await this.#failureCategoryRepository.findByUuid(uuid);
    }

    async getAllFailureCategries() {
        return await this.#failureCategoryRepository.findAll();
    }

    async getAllFailureTypes() {
        return await this.#failureTypeRepository.findAll();
    }

    async createFailureReport(failureReport) {
        console.info('Create FailureReport: ', failureReport);
        this.#failureReportRepository.create(failureReport);
    }

    get reportableAssetsWatcher() {
        return this.#reportableAssetsRepository.watchAll();
    }

    get failureReportsWatcher() {
        return this.#failureReportRepository.watchAll();
    }
}

export const failuresModule = new FailuresModule();

export class FailuresServiceWorker
{
    #database;
    #apiService;
    #reportableAssetRepository;
    #reportableAssetSynchronizer;

    constructor(
        apiClient,
        database = new FailuresDatabase()
    ) {
        console.warn('FailuresSW!!!');
        this.#apiService = new ApiService(apiClient);
        this.#database = database;

        console.log('init repo');
        this.#reportableAssetRepository = new ReportableAssetRepository(database.table('reportableAssets'));
        console.log('repo inited, syncer now:');
        this.#reportableAssetSynchronizer = new ReportableAssetSynchronizer(this.#apiService, this.#reportableAssetRepository);
        console.log('syncer inited', this.#reportableAssetSynchronizer);
    }

    syncInitialData() {
        console.log('failures-core:sw -> syncInitialData');
        this.#reportableAssetSynchronizer.sync();
    }

}
