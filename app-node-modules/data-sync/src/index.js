class DataSync
{
    #syncServices = new Map();

    registerSyncService(name, syncService) {
        this.#syncServices.set(name, syncService);
    }

    getSyncService(name) {
        return this.#syncServices.get(name);
    }

    greetings(name) {
        alert(`Hello ${name}!`);
    }

    notifyRecordQueued() {
        navigator.serviceWorker.controller?.postMessage({
            type: 'data-sync-record-queued'
        })
    }
}

export const dataSync = new DataSync();
export { SyncableRepository } from "./syncable-repository";