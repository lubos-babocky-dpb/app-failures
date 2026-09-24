export class ReportableAsset
{
    #uuid;
    #code;
    #model;
    #type;

    /**
     * @param {Object} params
     * @param {string} params.uuid
     * @param {string} params.code
     * @param {string} params.model
     * @param {string} params.type
     */
    constructor({uuid, code, model, type})
    {
        if (!uuid || typeof uuid !== 'string') {
            throw new Error('ReportableAsset requires a valid uuid string.');
        }

        if (!code || typeof code !== 'string') {
            throw new Error('ReportableAsset requires a valid code string.');
        }

        this.#uuid = uuid;
        this.#code = code;
        this.#model = model ?? null;
        this.#type = type ?? null;
    }

    /** @returns {string} */
    get uuid() {
        return this.#uuid;
    }

    /** @returns {string} */
    get code() {
        return this.#code;
    }

    /** @returns {string|null} */
    get model() {
        return this.#model;
    }

    /** @returns {string|null} */
    get type() {
        return this.#type;
    }
}