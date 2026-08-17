<script setup>
    import { ref, onMounted, watch } from 'vue'; // PRIDANÝ WATCH SEM
    import { useI18n } from 'vue-i18n';
    import { useRouter, useRoute } from 'vue-router';
    import { syncStaticData, syncPendingFailures, syncFailureStatuses } from './sync';

    const { t, locale } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const isMenuOpen = ref(false);

    watch(locale, (newLocale) => {
        localStorage.setItem('dpb_locale', newLocale);
    });

    const navigationItems = [
        { id: '/', labelKey: 'nav.new_report', icon: 'M12 4v16m8-8H4' },
        { id: '/history', labelKey: 'nav.history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
    ];

    const toggleMenu = (status) => {
        isMenuOpen.value = status;
    };

    const navigateTo = (path) => {
        router.push(path);
        toggleMenu(false);
    };

    onMounted(async () => {
        try {
            await syncStaticData();
            await syncPendingFailures();
            await syncFailureStatuses();
        } catch (error) {
            console.warn('Inicializačná synchronizácia zlyhala (pravdepodobne offline režim):', error);
        }
    });
</script>

<template>
    <div class="min-h-screen bg-slate-100 text-slate-900 antialiased font-[sans-serif]">
        <header class="bg-[#e30613] text-white shadow-lg sticky top-0 z-50">
            <div class="px-4 py-4 flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <img :src="'/icon-512.png'" alt="DPB" class="w-10 h-10 object-contain">
                    <div class="leading-tight uppercase text-xs font-bold">
                        Dopravný podnik<br><span class="font-light text-white/90 uppercase">Bratislava</span>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <select v-model="locale" class="bg-white/10 text-white p-1 rounded text-sm border-none font-bold outline-none mr-2">
                        <option value="sk" class="text-slate-900">SK</option>
                        <option value="en" class="text-slate-900">EN</option>
                        <option value="ru" class="text-slate-900">RU</option>
                    </select>

                    <button class="p-2 active:scale-90 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>

                    <button @click="toggleMenu(true)" class="p-2 active:scale-90 transition-transform bg-white/10 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>

        <main class="max-w-xl mx-auto p-6">
            <router-view></router-view>
        </main>

        <div 
            @click="toggleMenu(false)"
            :class="[isMenuOpen ? 'block opacity-100' : 'hidden opacity-0']"
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
        ></div>

        <div 
            :class="[isMenuOpen ? 'translate-x-0' : 'translate-x-full']"
            class="fixed top-0 right-0 h-full w-80 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out p-6 flex flex-col"
        >
            <div class="flex justify-between items-center mb-10">
                <span class="text-slate-400 font-bold uppercase text-xs tracking-widest">Menu</span>
                <button @click="toggleMenu(false)" class="text-slate-400 p-2 text-2xl">✕</button>
            </div>

            <nav class="flex flex-col space-y-2">
                <button 
                    v-for="item in navigationItems" 
                    :key="item.id"
                    @click="navigateTo(item.id)"
                    :class="[route.path === item.id ? 'bg-[#e30613] text-white shadow-lg' : 'text-slate-600 active:bg-slate-100']"
                    class="flex items-center space-x-4 p-5 rounded-2xl font-black uppercase tracking-tight transition-all text-left w-full"
                >
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
                    </svg>
                    <span>{{ t(item.labelKey) }}</span>
                </button>
            </nav>

            <div class="mt-auto pt-6 border-t border-slate-100 text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                Momos System v1.2 | DPB 2026
            </div>
        </div>
    </div>
</template>