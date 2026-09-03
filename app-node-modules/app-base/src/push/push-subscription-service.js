import { PushSubscriptionEndpoints } from "./endpoints";

export class PushSubscriptionService
{
    #vapidPublicKey;
    #apiClient;

    constructor({
        vapidPublicKey,
        apiClient
    }) {
        this.#vapidPublicKey = vapidPublicKey;
        this.#apiClient = apiClient;
    }

    async getSubscription()
    {
        const registration = await navigator.serviceWorker.ready;

        return registration.pushManager.getSubscription();
    }

    async subscribe()
    {
        const registration = await navigator.serviceWorker.ready;

        return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.#urlBase64ToUint8Array(
                this.#vapidPublicKey
            ),
        });
    }

    async registerSubscription(subscription)
    {
        return this.#apiClient.request(
            PushSubscriptionEndpoints.CREATE,
            {
                subscription: subscription.toJSON(),
            },
        );
    }

    async getOrCreateSubscription()
    {
        let subscription = await this.getSubscription();

        if (!subscription) {
            subscription = await this.subscribe();
        }

        await this.registerSubscription(subscription);

        return subscription;
    }

    #urlBase64ToUint8Array(base64String)
    {
        const padding = '='.repeat(
            (4 - (base64String.length % 4)) % 4
        );

        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = atob(base64);

        return Uint8Array.from(
            rawData,
            character => character.charCodeAt(0)
        );
    }
}