export class ReportableAsset
{
    constructor({
        id,
        code,
        model,
        type,
    } = {}) {
        console.warn(`${this.constructor.name} is deprecated, use model from @dpb/failures-core`);
        this.id = id;
        this.code = code;
        this.model = model;
        this.type = type;
    }

    static fromRecord(record) {
        return new ReportableAsset({
            id: record.id,
            code: record.code,
            model: record.model,
            type: record.type,
        });
    }
}