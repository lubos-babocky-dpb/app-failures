
import { WatchableRepository } from '@dpb/app-base';
import { FailureTypeMapper } from './failure-type-mapper';


export class FailureTypeRepository extends WatchableRepository
{
    get mapper() {
        return FailureTypeMapper;
    }
}