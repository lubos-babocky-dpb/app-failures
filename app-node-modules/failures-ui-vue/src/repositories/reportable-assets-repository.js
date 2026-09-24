import { liveQuery } from 'dexie';
import { db } from '../db';
import { ReportableAsset } from '../models/reportable-asset';

class ReportableAssetsRepository
{
    async all() {
        const records = await db.reportableAssets.toArray();
        return records.map(
            record => ReportableAsset.fromRecord(record)
        );
    }

    live() {
        return liveQuery(async () => this.all());
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
            reportableAssets.map(asset => this.#toRecord(asset))
        );
    }

    #toRecord(asset) {
        return {
            uuid: asset.uuid,
            code: asset.code,
            model: asset.model,
            type: asset.type,
        };
    }
}

export const reportableAssetsRepository = new ReportableAssetsRepository();