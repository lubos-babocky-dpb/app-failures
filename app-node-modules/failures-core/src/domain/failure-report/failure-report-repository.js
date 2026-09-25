import { BaseRepository, watchableMixin } from "@dpb/app-base";
import { FailureReportMapper } from "./failure-report-mapper";
import { syncableMixin } from "../../../../data-sync/src/syncable-mixin";
import { FailureReportSynchronizer } from "./failure-report-synchronizer";

export class FailureReportRepository extends syncableMixin(
    watchableMixin(BaseRepository),
    new FailureReportSynchronizer(),
    'failure-reports-synchronizer'
) {
    get mapper() {
        return FailureReportMapper;
    }
}