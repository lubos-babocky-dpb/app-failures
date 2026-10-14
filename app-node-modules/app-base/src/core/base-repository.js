export class BaseRepository
{
    #tablePromise;

    constructor(
        tablePromise
    ) {
        this.#tablePromise = tablePromise;
    }

    get tablePromise() {
        return this.#tablePromise;
    }


    get mapper() {
        console.warn(`Define mapper in ${this.constructor.name}`);
        throw new Error(`Mapper not defined in ${this.constructor.name}`);
    }

    async findAll() {
        return (await (await this.tablePromise).toArray())
            .map(record => this.mapper.toDomain(record));
    }

    async findRawByUuid(uuid) {
        return await (await this.tablePromise).get(uuid);
    }

    async findByUuid(uuid) {
        return this.mapper.toDomain(await this.findRawByUuid(uuid));
    }

    async create(model) {
        return await (await this.tablePromise)
            .put(this.mapper.toPersistence(model));
    }

    async update(model) {

    }

    async delete(model) {

    }

    async deleteByUuid(uuid) {

    }

    async replaceAll(models) {
        const table = await this.tablePromise;
        const persistenceRows = models.map(model => this.mapper.toPersistence(model));
        return await table.db.transaction('rw', table, async () => {
            await table.clear();
            await table.bulkPut(persistenceRows);
            console.log(`table ${table.name} replaced with fresh data`);
        })
    }
}