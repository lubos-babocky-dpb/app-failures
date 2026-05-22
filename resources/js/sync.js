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
            const serverFailures = await response.json(); // [{id: 1, status: "odoslané"}]

            // Ak bol spustený migrate:fresh (server je prázdny), premažeme lokálne zosynchronizované poruchy
            if (serverFailures.length === 0) {
                // Vymažeme iba tie, ktoré už boli odoslané (status 'synced'), neodpalujeme vodičovi rozpísané 'pending_sync'
                await db.failures.where('status').equals('synced').delete();
                console.log('[DEBUG-SYNC] Server DB is empty. Cleared all local "synced" records.');
                return;
            }

            const serverIds = serverFailures.map(f => f.id);
            const localFailures = await db.failures.toArray();

            for (const localFailure of localFailures) {
                // Sledujeme iba úspešne odoslané veci, tie ktoré čakajú na sync preskakujeme
                if (localFailure.status === 'pending_sync') continue;

                // Ak záznam na serveri už neexistuje, zmažeme ho aj z IndexedDB
                if (!serverIds.includes(localFailure.id)) {
                    await db.failures.delete(localFailure.id);
                    console.log(`[DEBUG-SYNC] Deleted orphaned local record ID: ${localFailure.id}`);
                    continue;
                }

                // Ak na serveri existuje, aktualizujeme stav podľa dispečera (v riešení, vyriešené...)
                const serverRecord = serverFailures.find(f => f.id === localFailure.id);
                if (serverRecord && localFailure.status !== serverRecord.status) {
                    await db.failures.update(localFailure.id, { status: serverRecord.status });
                    console.log(`[DEBUG-SYNC] Record ID ${localFailure.id} status updated to: ${serverRecord.status}`);
                }
            }
        }
    } catch (error) {
        console.error('[DEBUG-SYNC] Error during failure statuses sync:', error);
    }
};