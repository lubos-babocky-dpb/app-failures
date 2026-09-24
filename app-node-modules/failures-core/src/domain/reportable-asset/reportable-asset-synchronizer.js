import { ApiService } from "../../api/api-service";
import { ReportableAssetRepository } from "./reportable-asset-repository";

export class ReportableAssetSynchronizer
{
    /** @type {ApiService} */
    #apiService;

    /** @type {ReportableAssetRepository} */
    #repository;

    /**
     * @param {ApiService} apiService
     */
    constructor(apiService, repository) {
        this.#apiService = apiService;
        this.#repository = repository;
    }

    async sync() {
        console.log('awaiting table->findAll()', this.#repository);
        try {
            const tableData = await this.#repository.findByUuid('5866306e-9aef-11f1-83a3-0050568c1053');
            console.log('tableData ', tableData);
        } catch (e) {
            console.error(e);
        }
        console.info('clear db!');
        return;
/*
        const response = await this.#apiService.getReportableAssets();
        const body = await response.json();

        const persistenceRows = body.data.map(apiRow => {
            const domainModel = ReportableAssetMapper.toDomainFromApi(apiRow);
            return ReportableAssetMapper.toPersistence(domainModel);
        });

        await failureDb.transaction('rw', [failureDb.reportableAssets], async () => {
            await failureDb.reportableAssets.clear();
            await failureDb.reportableAssets.bulkAdd(persistenceRows);
        });
/**/
    }
}