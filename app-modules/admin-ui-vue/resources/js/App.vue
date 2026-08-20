<script setup>
    import { computed, onMounted, onUnmounted, ref } from 'vue';
    import router from './admin-router.js';
    import admin from './services/admin-registry.js';
    import { Gatekeeper, IdentityUpdatedEvent } from '@dpb/gatekeeper';

    const menuItems = admin.getMenuItems();

    const currentUser = ref(Gatekeeper.identity?.user ?? null);

    function handleIdentityUpdated() {
        currentUser.value = Gatekeeper.identity?.user ?? null;
    }

    onMounted(() => {
        Gatekeeper.addEventListener(IdentityUpdatedEvent.TYPE, handleIdentityUpdated);
    })

    onUnmounted(() => {
        Gatekeeper.removeEventListener(IdentityUpdatedEvent.TYPE, handleIdentityUpdated);
    });

    async function handleLogout() {

        await Gatekeeper.logout();

        await router.replace({
            name: 'admin.login',
        });
    }
</script>

<template>
    <div class="min-h-screen bg-slate-100 text-slate-900 antialiased font-[sans-serif]">
        <header class="bg-[#e30613] text-white shadow-lg sticky top-0 z-50">
            <div class="px-4 py-4 flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <img
                        :src="'/icon-512.png'"
                        alt="DPB"
                        class="w-10 h-10 object-contain"
                    >

                    <div class="leading-tight uppercase text-xs font-bold">
                        Dopravný podnik<br>
                        <span class="font-light text-white/90">
                            Bratislava
                        </span>
                    </div>
                </div>

                <nav
                    class="flex items-center gap-4"
                    v-if="currentUser"
                >
                    <RouterLink
                        v-for="item in menuItems"
                        :key="item.route"
                        :to="{ name: item.route }"
                        class="text-sm font-medium text-white/90 transition hover:text-white"
                    >
                        {{ item.label }}
                    </RouterLink>
                </nav>
                <button
                    v-if="currentUser"
                    type="button"
                    class="text-sm font-medium text-white/90 transition hover:text-white"
                    @click="handleLogout"
                >
                    Odhlásiť
                </button>

            </div>
        </header>

        <main class="max-w-7xl mx-auto p-6">
            <RouterView />
        </main>
    </div>
</template>