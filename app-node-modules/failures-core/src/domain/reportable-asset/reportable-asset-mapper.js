import { ReportableAsset } from "./reportable-asset";

export class ReportableAssetMapper
{
    /**
     * Converts plain DTO record from Dexie to domain model
     * @param {Object} row 
     * @returns {ReportableAsset}
     */
    static toDomain(row) {
        if(!row) {
            return null;
        }

        return new ReportableAsset({
            uuid: row.uuid,
            code: row.code,
            model: row.model,
            type: row.type
        });
    }

    /**
     * Converts JSON from API to domain model
     * @param {Object} apiRow 
     * @returns {ReportableAsset|null}
     */
    static toDomainFromApi(apiRow) {
        if (!apiRow) return null;

        return new ReportableAsset({
            uuid: apiRow.uuid,
            code: apiRow.code,
            model: apiRow.model ?? null,
            type: apiRow.type ?? null,
        });
    }

    /**
     * Converts domain model to plain DTO object for Dexie
     * @param {ReportableAsset} asset 
     * @returns {Object}
     */
    static toPersistence(asset) {
        return {
            uuid: asset.uuid,
            code: asset.code,
            model: asset.model,
            type: asset.type,
        };
    }
}