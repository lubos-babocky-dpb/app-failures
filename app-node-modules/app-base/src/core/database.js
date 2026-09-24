import Dexie from 'dexie';

export class Database
{
    #name;
    #tables = [];
    #database;
    #isOpened = false;

    constructor(name)
    {
        this.#name = name;
    }

    createTable(name, indexes)
    {
        if(this.#isOpened) {
            console.warn(`Table ${this.#name} is already opened`);
            return;
        }

        this.#tables.push(new TableConfig({
            name,
            indexes,
            version: 1
        }));

        return this;
    }

    updateTable(name, indexes, version)
    {

        if(this.#isOpened) {
            console.warn(`Table ${this.#name} is already opened`);
            return;
        }
        this.#tables.push(new TableConfig({
            name,
            indexes,
            version
        }));

        return this;
    }

    async open()
    {
        if(this.#isOpened) {
            console.warn(`Table ${this.#name} is already opened`);
            return;
        }

        this.#database = new Dexie(this.#name);

        const groupedTables = Object.groupBy(
            this.#tables,
            table => table.version
        );

        for (const [version, tables] of Object.entries(groupedTables)) {
            const stores = tables.reduce((schema, table) => {
                schema[table.name] = table.indexes;

                return schema;
            }, {});

            this.#database
                .version(Number(version))
                .stores(stores);
        }

        await this.#database.open();

        this.#isOpened = true;

        return this;
    }

    table(name)
    {
        return this.#database.table(name);
    }

    transaction(mode, tables, callback)
    {
        return this.#database.transaction(
            mode,
            tables,
            callback
        );
    }
}

class TableConfig
{
    constructor({
        name,
        indexes,
        version
    }) {
        this.name = name;
        this.indexes = indexes;
        this.version = version;
    }
}