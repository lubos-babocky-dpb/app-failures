import Dexie from 'dexie'; 
console.warn('still exporting db in failures module!');
export const db = new Dexie('DPB_Failures'); 

db.version(1).stores({ 
    reportableAssets: 'uuid', 
    failureCategories: 'uuid, parent_uuid', 
    failureTypes: 'uuid, category_uuid', 
    failureReports: 'uuid, reportable_id, category_id, status, created_at' 
}); 

export const failureDb = Object.freeze({ 
    reportableAssets: db.reportableAssets, 
    failureTypes: db.failureTypes, 
    failureCategories: db.failureCategories, 
    failureReports: db.failureReports,
    
    /**
     * Runs operation in Dexie transaction
     * @param {string} mode - 'r' or 'rw'
     * @param {Array} tables - array of tabules
     * @param {Function} callback 
     */
    transaction: async (mode, tables, callback) => {
        return await db.transaction(mode, tables, callback);
    }
});