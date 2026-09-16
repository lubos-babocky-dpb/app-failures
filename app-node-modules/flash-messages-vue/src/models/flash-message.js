export class FlashMessage
{
    constructor({
        uuid = crypto.randomUUID(),
        title,
        body,
        severity = 'info',
        createdAt = Date.now(),
        readAt = null
    } = {}) {
        this.uuid = uuid;
        this.title = title;
        this.body = body;
        this.severity = severity;
        this.createdAt = createdAt;
        this.readAt = readAt;
    }
}