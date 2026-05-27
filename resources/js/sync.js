import { db } from './db';

/**
 * Synchronizes core data registries from the server to the client's local IndexedDB.
 * This guarantees full offline accessibility for the PWA form.
 */
export const syncStaticData = async () => {
    // Check connectivity layout before executing fetch request streams
    if (!navigator.onLine) {
        console.log('Device is offline. Skipping static data synchronization.');
        return;
    }

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
    
    // Check connectivity layout before parsing structural queues
    if (!navigator.onLine) {
        console.log('[DEBUG-SYNC] Device is offline. Postponing report upload.');
        console.log('[DEBUG-SYNC] <<< syncPendingFailures() finished');
        return;
    }

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
            console.log(`[DEBUG-SYNC] Attempting to POST record UUID: ${failure.uuid} to server...`);
            
            // Re-verify connection layout mid-loop execution parameters
            if (!navigator.onLine) {
                console.warn('[DEBUG-SYNC] Network lost during synchronization loop. Aborting remainder.');
                break;
            }

            const response = await fetch('/api/v1/failures/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-User-UUID': deviceUuid
                },
                body: JSON.stringify({
                    uuid: failure.uuid,
                    vehicle_id: failure.vehicle_id,
                    user_uuid: deviceUuid,
                    category_id: failure.category_id,
                    note: failure.note,
                    photo_path: failure.photo_path,
                    client_created_at: failure.created_at
                })
            });

            console.log(`[DEBUG-SYNC] Server response status for UUID ${failure.uuid}:`, response.status);

            if (response.ok) {
                console.log(`[DEBUG-SYNC] Success! Server acknowledged report. Updating local DB status to "synced"...`);
                const updateCount = await db.failures.update(failure.uuid, { status: 'synced' });
                console.log(`[DEBUG-SYNC] Local DB update confirmed. Rows affected: ${updateCount}`);
            } else {
                const errorText = await response.text();
                console.error(`[DEBUG-SYNC] Server rejected record UUID ${failure.uuid}. Response:`, errorText);
            }
        }
    } catch (error) {
        // Demote execution thread errors to warning logging upon basic fetch layer faults
        if (error.name === 'TypeError' || error.message.includes('fetch')) {
            console.warn('[DEBUG-SYNC] Network connectivity issues during sync loop:', error.message);
        } else {
            console.error('[DEBUG-SYNC] Real unexpected error during synchronization loop:', error);
        }
    }
    
    console.log('[DEBUG-SYNC] <<< syncPendingFailures() finished');
};

/**
 * Pulls current failure statuses from the server and updates or cleans local IndexedDB.
 */
export const syncFailureStatuses = async () => {
    if (!navigator.onLine) return;

    const deviceUuid = localStorage.getItem('dpb_user_uuid');
    if (!deviceUuid) return;

    try {
        console.log('[DEBUG-SYNC] Fetching current statuses from server...');
        const response = await fetch(`/api/v1/failures/statuses?user_uuid=${deviceUuid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const serverFailures = await response.json(); // Expected payload structure: [{uuid: "...", status: "reported"}]

            // If remote DB was cleared, wipe all local synced entries
            if (serverFailures.length === 0) {
                await db.failures.where('status').equals('synced').delete();
                console.log('[DEBUG-SYNC] Server DB is empty. Cleared all local "synced" records.');
                return;
            }

            const serverUuids = serverFailures.map(f => f.uuid);
            const localFailures = await db.failures.toArray();

            for (const localFailure of localFailures) {
                // Keep local unsynced drafts untouched
                if (localFailure.status === 'pending_sync') continue;

                // Delete local record directly using uuid if it no longer exists on the server
                if (!serverUuids.includes(localFailure.uuid)) {
                    await db.failures.delete(localFailure.uuid); 
                    console.log(`[DEBUG-SYNC] Deleted orphaned local record UUID: ${localFailure.uuid}`);
                    continue;
                }

                // Update local life-cycle status using uuid match
                const serverRecord = serverFailures.find(f => f.uuid === localFailure.uuid);
                if (serverRecord && localFailure.status !== serverRecord.status) {
                    await db.failures.update(localFailure.uuid, { status: serverRecord.status });
                    console.log(`[DEBUG-SYNC] Record UUID ${localFailure.uuid} status updated to: ${serverRecord.status}`);
                }
            }
        }
    } catch (error) {
        console.error('[DEBUG-SYNC] Error during failure statuses sync:', error);
    }
};