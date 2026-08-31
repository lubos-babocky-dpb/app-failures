import { FailuresSynchronizer } from "./failures-synchronizer";
import { PushNotifications } from "./services/push-notifications";

export class FailuresServiceWorker
{
    #failuresSynchronizer;
    #pushNotifications;

    async initialize() {
        const { Gatekeeper } = await import('@dpb/gatekeeper');
        this.#failuresSynchronizer = new FailuresSynchronizer(
            Gatekeeper.token
        );

        this.#pushNotifications = new PushNotifications();
        this.#registerListeners();
        this.#registerPushNotificationEvents();
    }

    #registerListeners() {
        self.addEventListener('message', event => {
            console.log('SW MESSAGE RECEIVED:', event.data);
            const syncHandlers = {
                'sync-reportable-assets': () => this.#syncReportableAssets(),
                'sync-failure-types': () => this.#syncFailureTypes(),
                'sync-failure-categories': () => this.#syncFailureCategories(),
                'sync-failure-reports': () => this.#syncFailureReports(),
            };
            const handler = syncHandlers[event.data?.type];
            if (handler) {
                event.waitUntil(handler());
            }
        });
    }

    #registerPushNotificationEvents() {
        this.#pushNotifications.register('sync-reportable-assets', () => this.#syncReportableAssets());
        this.#pushNotifications.register('sync-failure-types', () => this.#syncFailureTypes());
        this.#pushNotifications.register('sync-failure-categories', () => this.#syncFailureCategories());
        this.#pushNotifications.register('sync-failure-reports', () => this.#syncFailureReports());
    }

    async #syncReportableAssets() {
        await this.#failuresSynchronizer.syncReportableAssets();
    }

    async #syncFailureTypes() {
        await this.#failuresSynchronizer.syncFailureTypes();
    }

    async #syncFailureCategories() {
        await this.#failuresSynchronizer.syncFailureCategories();
    }

    async #syncFailureReports() {
        await this.#failuresSynchronizer.syncFailureReports();
    }
}