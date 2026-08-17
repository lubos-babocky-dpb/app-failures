<script setup>
    import { useI18n } from 'vue-i18n';
    import { useRoute, useRouter } from 'vue-router';
    import SidePanel from './SidePanel.vue';

    const router = useRouter();
    const route = useRoute();

    const { t } = useI18n();

    const navigationItems = router
        .getRoutes()
        .filter(item => item.meta.isMenuItem);
</script>

<template>
    <SidePanel>
        <template #trigger="{ open }">
            <button
                @click="open"
                class="p-2 active:scale-90 transition-transform bg-white/10 rounded-lg"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                    />
                </svg>
            </button>
        </template>

        <template #default="{ close }">
            <div class="flex justify-between items-center mb-10">
                <span class="text-slate-400 font-bold uppercase text-xs tracking-widest">
                    Menu
                </span>

                <button
                    @click="close"
                    class="text-slate-400 p-2 text-2xl"
                >
                    ✕
                </button>
            </div>

            <nav class="flex flex-col space-y-2">
                <button
                    v-for="item in navigationItems"
                    :key="item.path"
                    @click="router.push(item.path); close()"
                    :class="[
                        route.path === item.path
                            ? 'bg-[#e30613] text-white shadow-lg'
                            : 'text-slate-600 active:bg-slate-100'
                    ]"
                    class="flex items-center space-x-4 p-5 rounded-2xl font-black uppercase tracking-tight transition-all text-left w-full"
                >
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-width="2" :d="item.meta.icon" />
                    </svg>

                    <span>{{ t(item.meta.labelKey) }}</span>
                </button>
            </nav>
        </template>
    </SidePanel>
</template>