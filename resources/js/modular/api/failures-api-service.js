import { ApiClient } from '@dpb/app-base-vue/api/ApiClient';
import * as Endpoints from "./endpoints";

export class FailuresApiService
{
    #apiClient;

    /**
     * @param {ApiClient} apiClient 
     */
    constructor({
        baseUrl = '',
        bearerToken = null,
        apiClient = new ApiClient({
            baseUrl: baseUrl,
            bearerToken: bearerToken
        })
    } = {}) {
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
}