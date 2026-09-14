
import { UserManager } from "@dpb/user-manager-ui-vue";
import { FailuresSynchronizer } from "./failures-synchronizer";
import { PushNotifications } from "./services/push-notifications";
import { dataSync } from "@dpb/data-sync";

export class FailuresServiceWorker
{
    #userManager;
    #failuresSynchronizer;
    #pushNotifications;

    async initialize() {
        console.log('SW init');
        const { Gatekeeper } = await import('@dpb/gatekeeper');
        console.log(dataSync);
        this.#failuresSynchronizer = new FailuresSynchronizer(Gatekeeper.token);
        this.#userManager = new UserManager(Gatekeeper.token);

        this.#pushNotifications = new PushNotifications();
        this.#registerListeners();
        this.#registerPushNotificationEvents();
    }

    #registerListeners() {
        self.addEventListener('message', event => {
            console.log('SW MESSAGE RECEIVED:', event.data);
            const syncHandlers = {
                'sync-initial-data': () => this.#syncInitialData(),
                'sync-reportable-assets': () => this.#syncReportableAssets(),
                'sync-failure-types': () => this.#syncFailureTypes(),
                'sync-failure-categories': () => this.#syncFailureCategories(),
                'sync-failure-reports': () => this.#syncFailureReports(),
                'sync-user-manager-data': () => this.#userManager.userSyncService.syncAllFromApi(),
                'data-sync-record-queued': () => console.log('init data-sync')
            };
            const handler = syncHandlers[event.data?.type];
            if (handler) {
                event.waitUntil(handler());
            }
        });
    }

    async #syncInitialData() {
        await Promise.all([
            this.#syncReportableAssets(),
            this.#syncFailureTypes(),
            this.#syncFailureCategories(),
            this.#syncFailureReports(),
        ]);
    }

    #registerPushNotificationEvents() {
        this.#pushNotifications.register('sync-initial-data', () => this.#syncInitialData());
        this.#pushNotifications.register('sync-reportable-assets', () => this.#syncReportableAssets());
        this.#pushNotifications.register('sync-failure-types', () => this.#syncFailureTypes());
        this.#pushNotifications.register('sync-failure-categories', () => this.#syncFailureCategories());
        this.#pushNotifications.register('sync-failure-reports', () => this.#syncFailureReports());
        this.#pushNotifications.register('sync-user-manager-data', () => this.#userManager.userSyncService.syncAllFromApi());
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