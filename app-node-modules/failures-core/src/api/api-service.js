import * as Endpoints from "./api-endpoints";

export class ApiService
{
    #apiClient;

    /**
     * @param {ApiClient} apiClient 
     */
    constructor(
        apiClient
    ) {
        this.#apiClient = apiClient;
    }

    async getReportableAssets() {
        return this.#apiClient.request(
            Endpoints.ReportableAssetsEndpoints.READ
        );
    }

    async getFailureTypes() {
        return this.#apiClient.request(
            Endpoints.FailureTypesEndpoints.READ
        );
    }

    async getFailureCategories() {
        return this.#apiClient.request(
            Endpoints.FailureCategoriesEndpoints.READ
        );
    }

    async getFailureReports() {
        return this.#apiClient.request(
            Endpoints.FailureReportsEndpoints.READ
        );
    };

    async createFailureReport(failureReport) {
        console.log(this.#apiClient);
        return this.#apiClient.request(
            Endpoints.FailureReportsEndpoints.CREATE,
            {failureReport: failureReport}
        );
    }
}