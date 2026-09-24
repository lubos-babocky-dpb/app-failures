import { FailureType } from "./failure-type";

export class FailureTypeMapper
{
    /**
     * Converts plain DTO record from Dexie to domain model
     * @param {Object} row
     * @returns {FailureType|null}
     */
    static toDomain(row) {
        if (!row) {
            return null;
        }

        return new FailureType({
            uuid: row.uuid,
            categoryUuid: row.category_uuid,
            name: row.name
        });
    }

    /**
     * Converts JSON from API to domain model
     * @param {Object} apiRow
     * @returns {FailureType|null}
     */
    static toDomainFromApi(apiRow) {
        if (!apiRow) return null;

        return new FailureType({
            uuid: apiRow.uuid,
            categoryUuid: apiRow.category_uuid,
            name: apiRow.name
        });
    }

    /**
     * Converts domain model to plain DTO object for Dexie
     * @param {FailureType} failureType
     * @returns {Object}
     */
    static toPersistence(failureType) {
        return {
            uuid: failureType.uuid,
            category_uuid: failureType.categoryUuid,
            name: failureType.name
        };
    }
}