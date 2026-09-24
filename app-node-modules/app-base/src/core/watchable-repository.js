import { liveQuery } from "dexie";

export class WatchableRepository
{
    tablePromise;

    constructor(tablePromise) {
        try {
            this.tablePromise = tablePromise;
        } catch(e) {
            console.error(e);
        }
    }

    get mapper() {
        console.warn(`Define mapper in ${this.constructor.name}`);
        throw new Error(`Mapper not defined in ${this.constructor.name}`);
    }

    async findAll() {
        return (await (await this.tablePromise).toArray())
            .map(record => this.mapper.toDomain(record));
    }

    watchAll() {
        return liveQuery(async () => this.findAll());
    }

    async findByUuid(uuid) {
        const record = await (await this.tablePromise).get(uuid);
        return this.mapper.toDomain(record);
    }

    watchByUuid(uuid) {
        return liveQuery(async () => this.findByUuid(uuid));
    }

    async truncate() {

    }
}