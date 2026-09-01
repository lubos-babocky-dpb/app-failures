<script setup>
    async function syncReportables() {
        const registration = await navigator.serviceWorker.ready;

        console.log(registration);
        console.log('SW active: ', registration.active);

        registration.active.postMessage({
            type: 'sync-reportable-assets'
        });

        console.log('post message sent');
    }

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat(
            (4 - (base64String.length % 4)) % 4
        );

        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);

        return Uint8Array.from(
            rawData,
            character => character.charCodeAt(0)
        );
    };

    const subscribeToPush = async () => {
        const registration = await navigator.serviceWorker.ready;

        console.log('SW registration:', registration);

        const permission = await Notification.requestPermission();

        console.log('Notification permission:', permission);

        if (permission !== 'granted') {
            return;
        }

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                import.meta.env.VITE_VAPID_PUBLIC_KEY
            ),
        });

        const data = subscription.toJSON();

        console.log('Push subscription:', data);

        const response = await fetch('/api/push/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        });

        console.log('Server response:', await response.json());
    };

    const sendTestPush = async (type) => {
        const response = await fetch(
            `/api/push/send-test?type=${encodeURIComponent(type)}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        const data = await response.json();

        console.log('Push test response:', data);
    };

    const pushReportableAssets = () => {
        return sendTestPush('sync-reportable-assets');
    };

    const pushFailureTypes = () => {
        return sendTestPush('sync-failure-types');
    };

    const pushFailureCategories = () => {
        return sendTestPush('sync-failure-categories');
    };
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex flex-row gap-2">
            <button @click="syncReportables" class="btn-primary">
                test SW communication
            </button>

            <button @click="subscribeToPush" class="btn-primary">
                Register push
            </button>
        </div>

        <div>
            <h2>Push notifications</h2>
        </div>

        <div class="flex flex-row justify-center gap-2">
            <button @click="pushReportableAssets" class="btn-primary">
                Assets
            </button>

            <button @click="pushFailureTypes" class="btn-primary">
                Types
            </button>

            <button @click="pushFailureCategories" class="btn-primary">
                Categories
            </button>
        </div>
    </div>
</template>