<script setup>
    import { onMounted, onUnmounted, ref } from 'vue';
    import { Gatekeeper, IdentityUpdatedEvent } from '@dpb/gatekeeper';
    import LoginForm from '../components/forms/LoginForm.vue';

    let deviceUuid = ref(Gatekeeper.identity?.deviceUuid);
    const user = ref(Gatekeeper.user);

    const onIdentityUpdated = (event) => {
        user.value = event.identity?.user ?? null;
        deviceUuid.value = event.identity?.deviceUuid ?? null;
    };

    onMounted(() => {
        Gatekeeper.addEventListener(IdentityUpdatedEvent.TYPE, onIdentityUpdated);
    });

    onUnmounted(() => {
        Gatekeeper.removeEventListener(IdentityUpdatedEvent.TYPE, onIdentityUpdated);
    });
</script>
<template>
    <div class="h-full flex flex-col justify-between">
        <div v-if="!user">
            <LoginForm />
        </div>
        <div v-else>
            <pre>{{ JSON.stringify(user.value, null, 2) }}</pre>
            {{ user.name }}
            <button class="btn-primary" type="button" role="logout" @click="Gatekeeper.logout()">
                logout
            </button>
        </div>

        <div>
            <input
                :title="deviceUuid"
                :value="deviceUuid"
                class="align-bottom w-full"
                disabled
            />
        </div>
    </div>
</template>