export class FailureType
{
    constructor({
        uuid,
        categoryUuid,
        name
    } = {}) {
        console.warn(`${this.constructor.name} is deprecated, use model from @dpb/failures-core`);
        this.uuid = uuid;
        this.categoryUuid = categoryUuid;
        this.name = name;
    }

    static fromRecord(record) {
        return new FailureType({
            uuid: record.uuid,
            categoryUuid: record.category_uuid,
            name: record.name
        });
    }
}