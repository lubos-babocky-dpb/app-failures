import Dexie from 'dexie';
export const db = new Dexie('DPB_Poruchy');

db.version(1).stores({
    reportables: 'id',
    failure_categories: 'id',
    failure_reports: 'uuid, reportable_id, category_id, status, created_at',
    app_config: 'key',
});

export const failureDb = Object.freeze({
    reportables: db.reportables,
    categories: db.failure_categories,
    reports: db.failure_reports,
});