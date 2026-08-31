export class ReportableAsset
{
    constructor({
        id,
        code,
        model,
        type,
    } = {}) {
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