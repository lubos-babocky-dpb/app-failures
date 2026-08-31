import { liveQuery } from 'dexie';
import { db } from '../db';
import { FailureType } from '../models/failure-type';

class FailureTypesRepository
{
    live() {
        return liveQuery(async () => {
            const records = await db.failureTypes.toArray();

            return records.map(record => FailureType.fromRecord(record));
        });
    }

    async all() {
        const records = await db.failureTypes.toArray();

        return records.map(record => FailureType.fromRecord(record));
    }

    async get(uuid) {
        const record = await db.failureTypes.get(uuid);

        return record
            ? FailureType.fromRecord(record)
            : null;
    }

    async replaceAll(failureTypes) {
        await db.failureTypes.clear();
        await db.failureTypes.bulkPut(failureTypes);
    }
}

export const failureTypesRepository = new FailureTypesRepository();