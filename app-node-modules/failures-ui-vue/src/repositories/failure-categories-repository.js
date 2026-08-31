import { liveQuery } from 'dexie';
import { db } from '../db';

class FailureCategoriesRepository
{
    live() {
        return liveQuery(() => db.failureCategories.toArray());
    }

    async all() {
        return db.failureCategories.toArray();
    }

    async get(id) {
        return db.failureCategories.get(id);
    }

    async replaceAll(failureCategories) {
        await db.failureCategories.clear();
        await db.failureCategories.bulkPut(failureCategories);
    }
}

export const failureCategoriesRepository = new FailureCategoriesRepository();