
import { ReportableAsset } from "../reportable-asset/reportable-asset";
import { FailureType } from "../failure-type/failure-type";

export class FailureReport
{
    #uuid;
    #userUuid;
    #reportableAsset;
    #failureType;
    #note;
    #status;
    #photos;
    #createdAt;

    /**
     * @param {Object} params
     * @param {string} [params.uuid]
     * @param {string} [params.userUuid]
     * @param {ReportableAsset} [params.reportableAsset]
     * @param {FailureType} [params.failureType]
     * @param {string} [params.note]
     * @param {string} [params.status]
     * @param {string[]} [params.photos]
     * @param {string} [params.createdAt]
     */
    constructor({uuid, userUuid, reportableAsset, failureType, note, status, photos, createdAt} = {}) {
        this.#uuid = uuid ?? crypto.randomUUID();
        this.#userUuid = userUuid ?? null;
        this.#reportableAsset = reportableAsset ?? null;
        this.#failureType = failureType ?? null;
        this.#note = note ?? null;
        this.#status = status ?? 'new';
        this.#photos = photos ?? [];
        this.#createdAt = createdAt ?? new Date().toISOString();
    }

    static prepareNewFailureReport() {
        return new FailureReport();
    }

    #toParams() {
        return {
            uuid: this.#uuid,
            userUuid: this.#userUuid,
            reportableAsset: this.#reportableAsset,
            failureType: this.#failureType,
            note: this.#note,
            status: this.#status,
            photos: this.#photos,
            createdAt: this.#createdAt
        };
    }

    get uuid() {
        return this.#uuid;
    }

    get userUuid() {
        return this.#userUuid;
    }

    get reportableAsset() {
        return this.#reportableAsset;
    }

    get hasReportableAsset() {
        return this.#reportableAsset !== null;
    }

    get failureType() {
        return this.#failureType;
    }

    get hasFailureType() {
        return this.#failureType !== null;
    }

    get hasFailureTypeAndReportableAsset() {
        return this.hasFailureType && this.hasReportableAsset;
    }

    get note() {
        return this.#note;
    }

    get status() {
        return this.#status;
    }

    get photos() {
        return this.#photos;
    }

    get createdAt() {
        return this.#createdAt;
    }

    withUserUuid(userUuid) {
        return new FailureReport({ ...this.#toParams(), userUuid });
    }

    withReportableAsset(reportableAsset) {
        return new FailureReport({ ...this.#toParams(), reportableAsset });
    }

    withFailureType(failureType) {
        return new FailureReport({ ...this.#toParams(), failureType });
    }

    withNote(note) {
        return new FailureReport({ ...this.#toParams(), note });
    }

    withPhoto(photo) {
        return new FailureReport({
            ...this.#toParams(),
            photos: [...this.#photos, photo]
        });
    }
}