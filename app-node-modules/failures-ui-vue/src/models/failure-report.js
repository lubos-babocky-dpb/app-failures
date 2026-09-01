import { FailureType } from "./failure-type";
import { ReportableAsset } from "./reportable-asset";

export class FailureReport
{
    uuid;
    userUuid;
    reportableAsset;
    failureType;
    note;
    status;
    photos;
    createdAt;

    constructor({uuid, userUuid, reportableAsset, failureType, note, status, photos, createdAt} = {}) {
        this.uuid = uuid ?? crypto.randomUUID();
        this.userUuid = userUuid;
        this.reportableAsset = reportableAsset;
        this.failureType = failureType;
        this.note = note;
        this.status = status ?? 'new';
        this.photos = photos ?? [];
        this.createdAt = createdAt ?? new Date().toISOString()
    }

    static prepareNewFailureReport() {
        return new FailureReport();
    }

    hasReportableAsset() {
        return this.reportableAsset instanceof ReportableAsset;
    }

    hasFailureType() {
        return this.failureType instanceof FailureType;
    }

    hasFailureTypeAndReportableAsset() {
        return this.hasFailureType() && this.hasReportableAsset();
    }

    attachPhoto(photo) {
        this.photos.push(photo);
    }
}