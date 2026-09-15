import { dataSyncDb } from "./db";

export class SyncQueueRepository
{
    async add({
        syncService,
        modelUuid,
        operation,
        delta,
        updatedAt = new Date().toISOString(),
    }) {
        if(!syncService || !modelUuid || !operation) {
            console.error(arguments);
            throw new Error('Invalid sync queue record');
        }

        if (!['create', 'update', 'delete'].includes(operation)) {
            console.error(arguments);
            throw new Error('Invalid sync operation');
        }

        if(['create', 'update'].includes(operation) && !delta) {
            console.error(arguments);
            throw new Error(`Delta is required for ${operation}`);
        }

        return dataSyncDb.syncQueue.add({
            uuid: crypto.randomUUID(),
            syncService: syncService,
            modelUuid: modelUuid,
            operation: operation,
            delta: delta,
            updatedAt: updatedAt
        })
    }

    async all() {
        return dataSyncDb.syncQueue.toArray();
    }

    async remove(uuid) {
        return dataSyncDb.syncQueue.delete(uuid);
    }
}