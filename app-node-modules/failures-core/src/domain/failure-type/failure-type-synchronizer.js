import { ApiService } from "../../api/api-service";
import { FailureTypeRepository } from "./failure-type-repository";

export class FailureTypeSynchronizer
{
    
    /** @type {ApiService} */
    #apiService;

    /** @type {FailureTypeRepository} */
    #repository;

    /**
     * @param {ApiService} apiService
     */
    constructor(apiService, repository) {
        this.#apiService = apiService;
        this.#repository = repository;
    }

}