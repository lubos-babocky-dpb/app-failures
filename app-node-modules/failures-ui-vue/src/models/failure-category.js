export class FailureCategory
{
    #uuid;
    #parentUuid;
    #name;
    #path;
    #aliasOf;

    constructor({uuid, parentUuid, name, path, aliasOf} = {})
    {
        console.warn(`${this.constructor.name} is deprecated, use model from @dpb/failures-core`);
        this.#uuid = uuid;
        this.#parentUuid = parentUuid;
        this.#name = name;
        this.#path = path;
        this.#aliasOf = aliasOf;
    }
}