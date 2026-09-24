import { FailureCategory } from "./failure-category";

export class FailureCategoryMapper
{
    /**
     * Converts plain DTO record from Dexie to domain model
     * @param {Object} row
     * @returns {FailureCategory|null}
     */
    static toDomain(row) {
        if (!row) {
            return null;
        }

        return new FailureCategory({
            uuid: row.uuid,
            parentUuid: row.parent_uuid ?? null,
            name: row.name,
            path: row.path,
            aliasOf: row.aliasOf ?? null
        });
    }

    /**
     * Converts JSON from API to domain model
     * @param {Object} apiRow
     * @returns {FailureCategory|null}
     */
    static toDomainFromApi(apiRow) {
        if (!apiRow) return null;

        return new FailureCategory({
            uuid: apiRow.uuid,
            parentUuid: apiRow.parent_uuid ?? null,
            name: apiRow.name,
            path: apiRow.path,
            aliasOf: apiRow.aliasOf ?? null
        });
    }

    /**
     * Converts domain model to plain DTO object for Dexie
     * @param {FailureCategory} category
     * @returns {Object}
     */
    static toPersistence(category) {
        return {
            uuid: category.uuid,
            parent_uuid: category.parentUuid,
            name: category.name,
            path: category.path,
            aliasOf: category.aliasOf
        };
    }
}