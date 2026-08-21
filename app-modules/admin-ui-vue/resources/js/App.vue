<script setup>
    import { computed, onMounted, onUnmounted, ref } from 'vue';
    import { PageRouter } from '@dpb/page-router-vue';
    import { Gatekeeper, IdentityUpdatedEvent } from '@dpb/gatekeeper';
    import LogoutButton from './components/actions/LogoutButton.vue';

    const menuItems = PageRouter.menuItems;

    const currentUser = ref(Gatekeeper.identity?.user ?? null);

    function handleIdentityUpdated() {
        currentUser.value = Gatekeeper.identity?.user ?? null;
    }

    onMounted(() => Gatekeeper.addEventListener(IdentityUpdatedEvent.TYPE, handleIdentityUpdated));
    onUnmounted(() => Gatekeeper.removeEventListener(IdentityUpdatedEvent.TYPE, handleIdentityUpdated));
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
                <LogoutButton v-if="currentUser" />
            </div>
        </header>

        <main class="max-w-7xl mx-auto p-6">
            <RouterView />
        </main>
    </div>
</template>