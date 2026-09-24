export class FailureType
{
    #uuid;
    #categoryUuid;
    #name;

    /**
     * @param {Object} params
     * @param {string} params.uuid
     * @param {string} params.categoryUuid
     * @param {string} params.name
     */
    constructor({uuid, categoryUuid, name})
    {
        if (!uuid || typeof uuid !== 'string') {
            throw new Error('FailureType requires a valid uuid string.');
        }

        if (!categoryUuid || typeof categoryUuid !== 'string') {
            throw new Error('FailureType requires a valid categoryUuid string.');
        }

        if (!name || typeof name !== 'string') {
            throw new Error('FailureType requires a valid name string.');
        }

        this.#uuid = uuid;
        this.#categoryUuid = categoryUuid;
        this.#name = name;
    }

    /** @returns {string} */
    get uuid() {
        return this.#uuid;
    }

    /** @returns {string} */
    get categoryUuid() {
        return this.#categoryUuid;
    }

    /** @returns {string} */
    get name() {
        return this.#name;
    }
}