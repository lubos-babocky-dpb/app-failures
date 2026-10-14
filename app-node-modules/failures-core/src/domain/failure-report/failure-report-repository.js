import { BaseRepository, watchableMixin } from "@dpb/app-base";
import { FailureReportMapper } from "./failure-report-mapper";
import { syncableMixin } from "@dpb/data-sync";

export class FailureReportRepository extends syncableMixin(
    watchableMixin(BaseRepository),
    'failure-reports-synchronizer'
) {
    get mapper() {
        return FailureReportMapper;
    }
}