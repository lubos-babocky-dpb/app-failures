import { WatchableRepository } from '@dpb/app-base';
import { ReportableAssetMapper } from './reportable-asset-mapper';


export class ReportableAssetRepository extends WatchableRepository
{
    get mapper() {
        return ReportableAssetMapper;
    }
}