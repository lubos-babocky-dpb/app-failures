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

    async create(model) {
        const record = this.convertModelToDatabaseRecord(model);
        await this.#syncQueueRepository.add({
            syncService: this.#syncService,
            modelUuid: model.uuid,
            operation: 'create',
            delta: record
        });
        await this.#table.add(record);
        dataSync.notifyRecordQueued();
    }

    async update(model) {
        const record = this.convertModelToDatabaseRecord(model);
        await this.#syncQueueRepository.add({
            syncService: this.#syncService,
            modelUuid: model.uuid,
            operation: 'update',
            delta: record
        });
        await this.#table.add(record);
        dataSync.notifyRecordQueued();
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

    convertModelToDatabaseRecord(model)
    {
        throw new Error('Extend method convertModelToDatabaseRecord in your repository!');
    }
}