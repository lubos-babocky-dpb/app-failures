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

    const simulateModelChange = async (type) => {
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

        console.log('Model change simulation response: ', data);
    };

    const simulateReportableAssetsChange = () => {
        return simulateModelChange('sync-reportable-assets');
    };

    const simulateFailureTypesChange = () => {
        return simulateModelChange('sync-failure-types');
    };

    const simulateFailureCategoriesChange = () => {
        return simulateModelChange('sync-failure-categories');
    };
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex flex-row gap-2">
            <button @click="syncReportables" class="btn-primary">
                test SW communication
            </button>
        </div>

        <div>
            <h2>Simulate model change to trigger push event</h2>
        </div>

        <div class="flex flex-row justify-center gap-2">
            <button @click="simulateReportableAssetsChange" class="btn-primary">
                Assets
            </button>

            <button @click="simulateFailureTypesChange" class="btn-primary">
                Types
            </button>

            <button @click="simulateFailureCategoriesChange" class="btn-primary">
                Categories
            </button>
        </div>
    </div>
</template>