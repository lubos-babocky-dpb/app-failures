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
        console.log('🔥 PUSH EVENT RECEIVED:', event);
        console.log('🔥 PUSH DATA:', event.data?.text());

        const data = event.data?.json();

        if (!data?.type) {
            console.log('🔥 PUSH WITHOUT TYPE');
            return;
        }

        console.log('🔥 PUSH TYPE:', data.type);

        const handler = this.#handlers.get(data.type);

        if (!handler) {
            console.log('🔥 NO PUSH HANDLER FOR:', data.type);
            return;
        }

        event.waitUntil(handler(data));
    }
}