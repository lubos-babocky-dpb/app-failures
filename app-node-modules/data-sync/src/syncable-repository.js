import { dataSync } from ".";
import { SyncQueueRepository } from "./sync-queue-repository";

export class SyncableRepository
{
    #table;
    #syncService;
    #syncQueueRepository;

    constructor(
        table,
        syncService,
        syncQueueRepository = new SyncQueueRepository()
    ) {
        this.#table = table;
        this.#syncService = syncService;
        this.#syncQueueRepository = syncQueueRepository;
    }

    async delete(uuid) {
        await this.#syncQueueRepository.add({
            syncService: this.#syncService,
            modelUuid: uuid,
            operation: 'delete'
        });
        await this.#table.delete(uuid);
        dataSync.notifyRecordQueued();
    }
}