import { BaseRepository, watchableMixin } from '@dpb/app-base';
import { ReportableAssetMapper } from './reportable-asset-mapper';
import { syncableMixin } from '@dpb/data-sync';


export class ReportableAssetRepository extends syncableMixin(
    watchableMixin(BaseRepository),
    'reportable-assets-synchronizer'
) {
    get mapper() {
        return ReportableAssetMapper;
    }
}