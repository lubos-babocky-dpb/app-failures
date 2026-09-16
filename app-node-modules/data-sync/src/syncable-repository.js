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
        const original = await this.#table.get(model.uuid);
        const record = this.convertModelToDatabaseRecord(model);
        const delta = this.#computeDelta(original, record);
        await this.#syncQueueRepository.add({
            syncService: this.#syncService,
            modelUuid: model.uuid,
            operation: 'update',
            delta: delta
        });
        await this.#table.put(record);
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


    #computeDelta(original, current) {
        const delta = {};

        for (const key of Object.keys(current)) {
            // Deep comparison pre objekty a polia (ako permissions)
            if (JSON.stringify(original[key]) !== JSON.stringify(current[key])) {
                delta[key] = current[key];
            }
        }

        return delta;
    }
}