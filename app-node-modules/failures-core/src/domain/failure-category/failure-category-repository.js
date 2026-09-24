import { WatchableRepository } from "@dpb/app-base";
import { FailureCategoryMapper } from "./failure-category-mapper";

export class FailureCategoryRepository extends WatchableRepository
{
    get mapper() {
        return FailureCategoryMapper;
    }
}