export class PushNotifications
{
    #handlers = new Map();

    constructor()
    {
        self.addEventListener('push', this.#handlePushEvent.bind(this));
    }

    register(type, handler)
    {
        this.#handlers.set(type, handler);
    }

    #handlePushEvent(event)
    {
        const data = event.data?.json();
        if (!data?.type) {
            return;
        }

        const handler = this.#handlers.get(data.type);
        if (!handler) {
            return;
        }

        event.waitUntil(handler(data));
    }
}