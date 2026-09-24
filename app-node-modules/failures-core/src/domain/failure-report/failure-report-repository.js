import { WatchableRepository } from "@dpb/app-base";
import { FailureReportMapper } from "./failure-report-mapper";

export class FailureReportRepository extends WatchableRepository
{
    get mapper() {
        return FailureReportMapper;
    }
}