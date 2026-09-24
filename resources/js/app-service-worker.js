import { UserManager } from '@dpb/user-manager-ui-vue';
import { dataSync } from '@dpb/data-sync';
import { FailuresUiVue } from '@dpb/failures-ui-vue';
import { FailuresServiceWorker } from '@dpb/failures-core';

export class AppServiceWorker
{
    #initialization;
    #pushNotifications;
    #messageEvents;
    #gatekeeper;
    #userManager;
    #failuresModule;

    #failuresServiceWorker;

    constructor()
    {
        self.addEventListener('install', event => self.skipWaiting());
        self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

        this.#pushNotifications = new PushNotifications();
        this.#messageEvents = new ServiceWorkerMessages();

        this.#registerMessages();
        this.#registerPushNotificationEvents();
    }

    #registerMessages()
    {
        this.registerMessageHandler('sync-user-manager-data', () => this.#userManager.userSyncService.syncAllFromApi());
        this.registerMessageHandler('data-sync-record-queued', () => dataSync.sync());
        this.registerMessageHandler('sync-initial-data', () => {
            console.info('sync-initial-data');
            this.#failuresModule.syncService.syncAllFromApi();
            this.#failuresServiceWorker.syncInitialData();
        });
    }

    #registerPushNotificationEvents()
    {
        this.registerPushHandler('sync-user-manager-data', () => this.#userManager.userSyncService.syncAllFromApi());
    }

    async #initialize()
    {
        if (!this.#initialization) {
            this.#initialization = this.#doInitialization();
        }
        await this.#initialization;
    }

    async #doInitialization() {
        this.#gatekeeper = (await import('@dpb/gatekeeper')).Gatekeeper;

        this.#userManager = new UserManager(this.#gatekeeper.apiClient);
        this.#failuresModule = new FailuresUiVue(this.#gatekeeper.apiClient);

        this.#failuresServiceWorker = new FailuresServiceWorker(this.#gatekeeper.apiClient);

        console.info('START');
        this.#failuresServiceWorker.syncInitialData();
        console.info('END');
        
        dataSync.registerSyncService('users', this.#userManager.userSyncService);
    }

    registerMessageHandler(messageIdentifier, handler)
    {
        this.#messageEvents.register(messageIdentifier, async() => {
            await this.#initialize();
            return handler();
        });
    }

    registerPushHandler(pushIdentifier, handler)
    {
        this.#pushNotifications.register(pushIdentifier, async() => {
            await this.#initialize();
            return handler();
        });
    }
}


class PushNotifications
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

        const data = event.data?.json();

        if (!data?.type) {
            return;
        }

        const handler = this.#handlers.get(data.type);

        if (!handler) {
            console.warn('🔥 NO PUSH HANDLER FOR:', data.type);
            return;
        }

        event.waitUntil(handler(data));
    }
}

class ServiceWorkerMessages
{
    #handlers = new Map();

    constructor()
    {
        self.addEventListener('message', this.#handleMessage.bind(this));
    }

    register(type, handler)
    {
        this.#handlers.set(type, handler);
    }

    #handleMessage(event)
    {
        const handler = this.#handlers.get(event.data?.type);
        if (!handler) {
            return;
        }
        event.waitUntil(handler(event.data));
    }
}