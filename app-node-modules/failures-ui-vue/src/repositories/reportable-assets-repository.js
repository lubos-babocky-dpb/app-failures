import { liveQuery } from 'dexie';
import { db } from '../db';
import { ReportableAsset } from '../models/reportable-asset';

class ReportableAssetsRepository
{
    live() {
        return liveQuery(async () => {
            const records = await db.reportableAssets.toArray();
            return records.map(
                record => ReportableAsset.fromRecord(record)
            );
        });
    }

    async get(id) {
        const record = await db.reportableAssets.get(id);
        return record
            ? ReportableAsset.fromRecord(record)
            : undefined;
    }

    async replaceAll(reportableAssets) {
        await db.reportableAssets.clear();
        await db.reportableAssets.bulkPut(
            reportableAssets.map(asset => ({
                id: asset.id,
                code: asset.code,
                model: asset.model,
                type: asset.type,
            }))
        );
    }
}

export const reportableAssetsRepository = new ReportableAssetsRepository();