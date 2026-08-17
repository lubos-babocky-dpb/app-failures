import { db } from './db';

/**
 * Synchronizes core data registries from the server to the client's local IndexedDB.
 * This guarantees full offline accessibility for the PWA form.
 */
export const syncStaticData = async () => {
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
    
    if (!navigator.onLine) {
        console.log('[DEBUG-SYNC] Device is offline. Postponing report upload.');
        console.log('[DEBUG-SYNC] <<< syncPendingFailures() finished');
        return;
    }

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

        const deviceUuid = localStorage.getItem('dpb_user_uuid');

        for (const failure of pendingFailures) {
            console.log(`[DEBUG-SYNC] Attempting to POST record UUID: ${failure.uuid} to server...`);
            
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
                    photo: failure.photo,
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
            const rawServerFailures = await response.json();
            console.log('[DEBUG-SYNC] Raw payload from server:', rawServerFailures);

            // DEFENZÍVNY FILTER: Pustíme ďalej len tie objekty, ktoré majú aspoň nejaký identifikátor
            const serverFailures = Array.isArray(rawServerFailures) 
                ? rawServerFailures.filter(f => f && (f.uuid || f.id)) 
                : [];

            // 1. Ak server vrátil prázdne pole, premažeme lokálne synchronizované záznamy
            if (serverFailures.length === 0) {
                await db.failures.where('status').equals('synced').delete();
                console.log('[DEBUG-SYNC] Server DB is empty. Cleared all local "synced" records.');
                return;
            }

            // 2. Cyklus pre bezpečné ukladanie a aktualizáciu statusov
            for (const serverFailure of serverFailures) {
                // Striktne vytiahneme string kľúč, s ktorým Dexie dokáže pracovať
                const targetUuid = serverFailure.uuid || serverFailure.id;
                
                // Absolútna poistka proti Invalid argument to Table.get()
                if (!targetUuid || typeof targetUuid !== 'string') {
                    console.warn('[DEBUG-SYNC] Preskakujem nevalidný záznam zo servera kvôli chýbajúcemu UUID identifikátoru:', serverFailure);
                    continue;
                }

                const localRecord = await db.failures.get(targetUuid);

                if (!localRecord) {
                    // Inicializujeme objekt bez akýchkoľvek NULL hodnôt pre reaktívne Vue šablóny
                    const recordToAdd = {
                        uuid: targetUuid,
                        status: serverFailure.status || 'odoslané',
                        note: serverFailure.note || '',
                        created_at: serverFailure.client_created_at || serverFailure.created_at || new Date().toISOString()
                    };

                    // Cudzie kľúče pripájame explicitne iba ak reálne existujú, žiadne null/undefined fallbacky
                    if (serverFailure.vehicle_id) {
                        recordToAdd.vehicle_id = serverFailure.vehicle_id;
                    }
                    if (serverFailure.category_id) {
                        recordToAdd.category_id = serverFailure.category_id;
                    }
                    if (serverFailure.photo) {
                        recordToAdd.photo = serverFailure.photo;
                    }

                    await db.failures.add(recordToAdd);
                    console.log(`[DEBUG-SYNC] Bezpečne pridaná chýbajúca porucha zo servera: ${targetUuid}`);
                } else if (localRecord.status !== serverFailure.status && localRecord.status !== 'pending_sync') {
                    // Ak záznam existuje, iba zaktualizujeme stav z backendu
                    await db.failures.update(targetUuid, { status: serverFailure.status });
                    console.log(`[DEBUG-SYNC] Stav poruchy ${targetUuid} zmenený na: ${serverFailure.status}`);
                }
            }

            // 3. Vyčistenie lokálnych záznamov, ktoré už na serveri reálne neexistujú
            const serverUuids = serverFailures.map(f => f.uuid || f.id).filter(id => id && typeof id === 'string');
            const localFailures = await db.failures.toArray();

            for (const localFailure of localFailures) {
                if (localFailure.status !== 'pending_sync' && !serverUuids.includes(localFailure.uuid)) {
                    await db.failures.delete(localFailure.uuid); 
                    console.log(`[DEBUG-SYNC] Vymazaná osirelá lokálna porucha: ${localFailure.uuid}`);
                }
            }
            console.log('[DEBUG-SYNC] Failure statuses sync process completed.');
        } else {
            const errorText = await response.text();
            console.error(`[DEBUG-SYNC] Server responded with error status ${response.status}:`, errorText);
        }
    } catch (error) {
        console.error('[DEBUG-SYNC] Fatálna chyba počas behu syncFailureStatuses:', error);
    }
};