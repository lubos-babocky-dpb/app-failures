export class FailureType
{
    constructor({
        uuid,
        categoryUuid,
        name
    } = {}) {
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