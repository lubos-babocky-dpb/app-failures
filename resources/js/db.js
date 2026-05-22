import Dexie from 'dexie';

// Initialize the local IndexedDB instance for offline storage
export const db = new Dexie('DPB_Poruchy');

// Define the schema with primary keys and required lookup indexes
db.version(1).stores({
    vehicles: 'id',
    failure_categories: 'id',
    failures: '++id, vehicle_id, category_id, status, created_at',
    app_config: 'key'
});