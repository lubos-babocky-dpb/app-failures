import { db } from './db';

/**
 * Synchronizes core data registries from the server to the client's local IndexedDB.
 * This guarantees full offline accessibility for the PWA form.
 */
export const syncStaticData = async () => {
    try {
        console.log('Starting data synchronization...');

        // 1. Synchronize Vehicles Registry
        const vehicleResponse = await fetch('/api/v1/sync/vehicles');
        if (!vehicleResponse.ok) throw new Error('Failed to fetch vehicles from server');
        const vehicles = await vehicleResponse.json();
        
        await db.vehicles.clear();
        await db.vehicles.bulkAdd(vehicles);
        console.log('Vehicles synchronized successfully.');

        // 2. Synchronize Failure Categories Tree
        const categoryResponse = await fetch('/api/v1/sync/categories');
        if (!categoryResponse.ok) throw new Error('Failed to fetch categories from server');
        const categories = await categoryResponse.json();

        await db.failure_categories.clear();
        await db.failure_categories.bulkAdd(categories);
        console.log('Failure categories synchronized successfully.');

        console.log('All dynamic registries are now fully cached offline.');
    } catch (error) {
        console.error('Data synchronization failed:', error);
    }
};

/**
 * Pushes locally stored failure reports with 'pending_sync' status to the central server.
 * Updates the local record status upon successful server acknowledgment.
 */
export const syncPendingFailures = async () => {
    console.log('[DEBUG-SYNC] >>> syncPendingFailures() triggered');
    
    // Add a slight delay to ensure Dexie internal write transactions are fully closed
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        console.log('[DEBUG-SYNC] Querying IndexedDB for "pending_sync" records...');
        
        const pendingFailures = await db.failures
            .where('status')
            .equals('pending_sync')
            .toArray();

        console.log(`[DEBUG-SYNC] Found records in DB:`, pendingFailures);

        if (pendingFailures.length === 0) {
            console.log('[DEBUG-SYNC] No pending reports to sync. Exiting.');
            return;
        }

        // Pull the immutable device UUID from localStorage to append identity to the requests
        const deviceUuid = localStorage.getItem('dpb_user_uuid');

        for (const failure of pendingFailures) {
            console.log(`[DEBUG-SYNC] Attempting to POST record ID: ${failure.id} to server...`);
            
            const response = await fetch('/api/v1/failures/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-User-UUID': deviceUuid
                },
                body: JSON.stringify({
                    vehicle_id: failure.vehicle_id,
                    category_id: failure.category_id,
                    note: failure.note,
                    photo: failure.photo,
                    created_at: failure.created_at,
                    user_uuid: deviceUuid
                })
            });

            console.log(`[DEBUG-SYNC] Server response status for ID ${failure.id}:`, response.status);

            if (response.ok) {
                const result = await response.json();
                console.log(`[DEBUG-SYNC] Success! Server returned ID: ${result.id}. Updating local DB status to "synced"...`);
                
                const updateCount = await db.failures.update(failure.id, { status: 'synced' });
                console.log(`[DEBUG-SYNC] Local DB update confirmed. Rows affected: ${updateCount}`);
            } else {
                const errorText = await response.text();
                console.error(`[DEBUG-SYNC] Server rejected record ID ${failure.id}. Response:`, errorText);
            }
        }
    } catch (error) {
        console.error('[DEBUG-SYNC] FATAL ERROR during synchronization loop:', error);
    }
    
    console.log('[DEBUG-SYNC] <<< syncPendingFailures() finished');
};