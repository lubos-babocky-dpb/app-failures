import { FailureReport } from "./failure-report";

export class FailureReportMapper
{
    /**
     * Converts plain DTO record from Dexie to domain model
     * @param {Object} row
     * @returns {FailureReport|null}
     */
    static toDomain(row) {
        if (!row) return null;

        return new FailureReport({
            uuid: row.uuid,
            userUuid: row.userUuid,
            reportableAsset: row.reportableAsset,   // ← string (uuid)
            failureType: row.failureType,           // ← string (uuid)
            note: row.note,
            status: row.status,
            photos: row.photos ?? [],
            createdAt: row.clientCreatedAt         // ← clientCreatedAt
        });
    }

    /**
     * Converts JSON from API to domain model
     * @param {Object} apiRow
     * @returns {FailureReport|null}
     */
    static toDomainFromApi(apiRow) {
        if (!apiRow) return null;

        return new FailureReport({
            uuid: apiRow.uuid,
            userUuid: apiRow.user_uuid,
            reportableAsset: apiRow.reportable_asset,
            failureType: apiRow.failure_type,
            note: apiRow.note,
            status: apiRow.status,
            photos: apiRow.photos ?? [],
            createdAt: apiRow.client_created_at ?? apiRow.created_at
        });
    }

    /**
     * Converts domain model to plain DTO object for Dexie
     * @param {FailureReport} failureReport
     * @returns {Object}
     */
    static toPersistence(failureReport) {
        return {
            uuid: failureReport.uuid,
            userUuid: failureReport.userUuid,
            reportableAsset: failureReport.reportableAsset,
            failureType: failureReport.failureType,
            note: failureReport.note,
            status: failureReport.status,
            photos: failureReport.photos,
            clientCreatedAt: failureReport.createdAt
        };
    }
}