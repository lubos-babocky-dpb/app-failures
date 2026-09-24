export class FailureCategory
{
    #uuid;
    #parentUuid;
    #name;
    #path;
    #aliasOf;

    /**
     * @param {Object} params
     * @param {string} params.uuid
     * @param {string|null} params.parentUuid
     * @param {string} params.name
     * @param {string} params.path
     * @param {string|null} params.aliasOf
     */
    constructor({uuid, parentUuid, name, path, aliasOf})
    {
        if (!uuid || typeof uuid !== 'string') {
            throw new Error('FailureCategory requires a valid uuid string.');
        }

        if (!name || typeof name !== 'string') {
            throw new Error('FailureCategory requires a valid name string.');
        }

        if (!path || typeof path !== 'string') {
            throw new Error('FailureCategory requires a valid path string.');
        }

        this.#uuid = uuid;
        this.#parentUuid = parentUuid ?? null;
        this.#name = name;
        this.#path = path;
        this.#aliasOf = aliasOf ?? null;
    }

    /** @returns {string} */
    get uuid() {
        return this.#uuid;
    }

    /** @returns {string|null} */
    get parentUuid() {
        return this.#parentUuid;
    }

    /** @returns {string} */
    get name() {
        return this.#name;
    }

    /** @returns {string} */
    get path() {
        return this.#path;
    }

    /** @returns {string|null} */
    get aliasOf() {
        return this.#aliasOf;
    }
}