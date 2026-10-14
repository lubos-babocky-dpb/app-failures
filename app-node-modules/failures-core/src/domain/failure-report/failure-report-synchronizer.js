import { ApiService } from "../../api/api-service";
import { FailureReportMapper } from "./failure-report-mapper";
import { FailureReportRepository } from "./failure-report-repository";

export class FailureReportSynchronizer
{
    /** @type {ApiService} */
    #apiService;

    /** @type {FailureReportRepository} */
    #repository;

    constructor(apiService, repository) {
        this.#apiService = apiService;
        this.#repository = repository;
    }

    /**
     * @param {string} modelUuid 
     * @param {Object} delta 
     */
    async create(modelUuid, delta) {
        console.info(`FailureReportSynchnronizer called for uuid=${modelUuid} with delta: `, delta);
        const domainModel = FailureReportMapper.toDomain(delta);
        await this.#apiService.createFailureReport(domainModel);
        console.log('synced?');
    }

    async sync() {
        try {
            const response = await this.#apiService.getFailureReports();
            const body = await response.json();    
            const models = body.data.map(apiRow => FailureReportMapper.toDomainFromApi(apiRow));
            await this.#repository.replaceAll(models);
        } catch (e) {
            console.error(e);
        }
    }
}