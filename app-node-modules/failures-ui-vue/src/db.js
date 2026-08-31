import Dexie from 'dexie';
export const db = new Dexie('DPB_Failures');

db.version(1).stores({
    reportableAssets: 'id',
    failureCategories: 'uuid, parent_uuid',
    failureTypes: 'uuid, category_uuid',
    failureReports: 'uuid, reportable_id, category_id, status, created_at'
});

export const failureDb = Object.freeze({
    reportableAssets: db.reportableAssets,
    failureTypes: db.failureTypes,
    failureCategories: db.failureCategories,
    failureReports: db.failureReports,
});