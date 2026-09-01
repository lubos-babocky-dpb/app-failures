import { liveQuery } from 'dexie';
import { db } from '../db';
import { toRaw } from 'vue';
import { FailureReport } from '../models/failure-report';

class FailureReportsRepository
{
    live() {
        return liveQuery(async () => {
            const failureReports = await db.failureReports.toArray();

            return failureReports.map(
                failureReport => new FailureReport(failureReport)
            );
        });
    }

    async get(id) {
        const failureReport = await db.failureReports.get(id);

        return failureReport
            ? new FailureReport(failureReport)
            : undefined;
    }

    async replaceAll(failureReports) {
        await db.failureReports.clear();
        await db.failureReports.bulkPut(
            failureReports.map(failureReport => toRaw(failureReport))
        );
    }

    async save(failureReport) {
        await db.failureReports.add(toRaw(failureReport));
    }
}

export const failureReportsRepository = new FailureReportsRepository();