import { liveQuery } from 'dexie';
import { db } from '../db';
import { toRaw } from 'vue';

class FailureReportsRepository
{
    live() {
        return liveQuery(() => db.failureReports.toArray());
    }

    async get(id) {
        return db.failureReports.get(id);
    }

    async replaceAll(failureReports) {
        await db.failureReports.clear();
        await db.failureReports.bulkPut(failureReports);
    }

    async save(failureReport) {
        db.failureReports.add(toRaw(failureReport));
    }
}

export const failureReportsRepository = new FailureReportsRepository();