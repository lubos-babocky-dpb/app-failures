<script setup>
    import { Gatekeeper } from '@dpb/gatekeeper';
    import { PageRouter } from '@dpb/page-router-vue';
    import LoginPage from '../../pages/LoginPage.vue';


    async function handleLogout() {
        await Gatekeeper.logout();
        await PageRouter.redirect(LoginPage);
    }
</script>

<template>
    <button
        type="button"
        class="text-sm font-medium text-white/90 transition hover:text-white"
        @click="handleLogout"
    >
        Odhlásiť
    </button>
</template>