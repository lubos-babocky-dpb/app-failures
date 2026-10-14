import { ApiService } from "../../api/api-service";
import { ReportableAssetRepository } from "./reportable-asset-repository";
import { ReportableAssetMapper } from "./reportable-asset-mapper";

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
        try {
            const response = await this.#apiService.getReportableAssets();
            const body = await response.json();
            const models = body.data.map(apiRow => ReportableAssetMapper.toDomainFromApi(apiRow));
            await this.#repository.replaceAll(models);
        } catch (e) {
            console.error(e);
        }
    }
}