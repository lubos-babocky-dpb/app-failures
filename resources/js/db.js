import Dexie from 'dexie';

// Initialize the local IndexedDB instance for offline storage
export const db = new Dexie('DPB_Poruchy');

// --- VERSION 1: Legacy schema (preserved for seamless database migration in production) ---
db.version(1).stores({
    vehicles: 'id',
    failure_categories: 'id',
    failures: 'uuid, vehicle_id, category_id, status, created_at',
    app_config: 'key'
});

// --- VERSION 2: New decoupled module schema adhering to vendor_package_name convention ---
db.version(2).stores({
    // Legacy tables preserved for backward compatibility during refactoring
    vehicles: 'id',
    failure_categories: 'id',
    failures: 'uuid, vehicle_id, category_id, status, created_at',
    app_config: 'key',

    // New encapsulated failures package infrastructure tables
    dpb_failures_categories: 'id, parent_id',
    dpb_failures_types: 'id, category_id',
    dpb_failures_acl_rules: 'id, failure_type_id, type_id, model_id, reportable_id'
});

/**
 * Clean data layer abstractions for dependency injection into services and Vue components.
 * This prevents hardcoding the fully-qualified vendor string throughout the application.
 */
export const failureDb = Object.freeze({
    categories: db.dpb_failures_categories,
    types: db.dpb_failures_types,
    aclRules: db.dpb_failures_acl_rules
});