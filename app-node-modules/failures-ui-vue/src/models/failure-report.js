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

    constructor({uuid, userUuid, reportableAsset, failureType, note, status} = {}) {
        this.uuid = uuid ?? crypto.randomUUID();
        this.userUuid = userUuid;
        this.reportableAsset = reportableAsset;
        this.failureType = failureType;
        this.note = note;
        this.status = status ?? 'new'
    }

    static prepareNewFailureReport() {
        return new FailureReport();
    }

    get uuid() {
        return this.uuid;
    }

    get userUuid() {
        return this.userUuid;
    }

    get reportableAsset() {
        return this.reportableAsset;
    }

    get failureType() {
        return this.failureType;
    }

    get note() {
        return this.note;
    }

    get status() {
        return this.status;
    }

    set reportableAsset(reportableAsset) {
        this.reportableAsset = reportableAsset;
    }

    set failureType(failureType) {
        this.failureType = failureType;
    }

    set note(note) {
        this.note = note;
    }

    hasReportableAsset() {
        return this.reportableAsset instanceof ReportableAsset;
    }

    hasFailureType() {
        return this.failureType instanceof FailureType;
    }
}