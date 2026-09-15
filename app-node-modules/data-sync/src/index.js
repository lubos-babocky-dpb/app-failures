import { SyncQueueRepository } from "./sync-queue-repository";

class DataSync
{
    #syncServices = new Map();
    #syncQueueRepository = new SyncQueueRepository();

    registerSyncService(name, syncService) {
        this.#syncServices.set(name, syncService);
    }

    getSyncService(name) {
        return this.#syncServices.get(name);
    }

    async sync() {
        const records = await this.#syncQueueRepository.all();

        for (const record of records) {
            const syncService = this.getSyncService(record.syncService);
            if (!syncService) {
                console.warn(`Sync service "${record.syncService}" is not registered`);
                continue;
            }

            try {
                await syncService[record.operation](record.modelUuid, record.delta ?? null);
                await this.#syncQueueRepository.remove(record.uuid);
            } catch (error) {
                console.error(`Sync failed: ${record.syncService}.${record.operation}(${record.modelUuid})`, {record, error});
                throw error;
            }
        }
    }

    async notifyRecordQueued() {
        const registration = await navigator.serviceWorker.ready;
        registration.active?.postMessage({
            type: 'data-sync-record-queued'
        });
    }
}

export const dataSync = new DataSync();
export { SyncableRepository } from "./syncable-repository";