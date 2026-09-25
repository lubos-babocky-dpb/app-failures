import { dataSync } from ".";
import { SyncQueueRepository } from "./sync-queue-repository"

export const syncableMixin = (Base, synchronizer, syncServiceId) => class extends Base {
    #syncQueueRepository = new SyncQueueRepository();
    #syncServiceId = syncServiceId;

    constructor(...args) {
        super(...args);
        dataSync.registerSyncService(syncServiceId, synchronizer);
    }

    async create(model) {
        const modelUuid = await super.create(model);
        await this.#syncQueueRepository.add({
            syncService: this.#syncServiceId,
            modelUuid: model.uuid,
            operation: 'create',
            delta: this.mapper.toPersistence(model)
        });
        dataSync.notifyRecordQueued();
        return modelUuid;
    }

    async update(model) {
        const original = await (await super.tablePromise).get(model.uuid);
        const record = this.mapper.toPersistence(model);
        const delta = this.#computeDelta(original, record);

        await this.#syncQueueRepository.add({
            syncService: this.#syncServiceId,
            modelUuid: model.uuid,
            operation: 'update',
            delta: delta
        });
        const updateResponse = await super.update(model);
        dataSync.notifyRecordQueued();
        return updateResponse;
    }

    async delete(uuid) {
        await this.#syncQueueRepository.add({
            syncService: this.#syncServiceId,
            modelUuid: uuid,
            operation: 'delete'
        });
        await super.delete(uuid);
        dataSync.notifyRecordQueued();
    }

    #computeDelta(original, current) {
        const delta = {};

        for (const key of Object.keys(current)) {
            if (JSON.stringify(original[key]) !== JSON.stringify(current[key])) {
                delta[key] = current[key];
            }
        }
        return delta;
    }
}