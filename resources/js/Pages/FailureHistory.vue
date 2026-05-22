<script setup>
import { ref, onUnmounted } from 'vue';
import { liveQuery } from 'dexie';
import { db } from '../db';

const reports = ref([]);
const isLoading = ref(true);

/**
 * Formats a standardized ISO date string into Slovak localization layout.
 */
const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('sk-SK') + ' ' + d.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Truncates driver notes to a maximum length to fit UI limits.
 */
const getTruncatedNote = (note) => {
    if (!note) return null;
    return note.length > 50 ? note.substring(0, 50) + '...' : note;
};

/**
 * Resolves appropriate text and Tailwind color scheme classes based on sync or server lifecycle state.
 */
const getStatusBadge = (status) => {
    const statusMap = {
        'pending_sync': { text: 'Čaká na sieť', color: 'text-amber-600 animate-pulse' },
        'synced': { text: 'Odoslané', color: 'text-green-600' },
        'reported': { text: 'Nahlásené', color: 'text-[#e30613]' },
        'accepted': { text: 'Prijaté', color: 'text-blue-600' },
        'resolved': { text: 'Vyriešené', color: 'text-gray-500' }
    };
    return statusMap[status] || { text: 'Nahlásené', color: 'text-[#e30613]' };
};

// Create a real-time reactive database subscription using Dexie liveQuery
const subscription = liveQuery(async () => {
    const localFailures = await db.failures.reverse().toArray();
    
    // Hydrate local records with core vehicle entities
    return await Promise.all(localFailures.map(async (report) => {
        const vehicle = await db.vehicles.get(Number(report.vehicle_id) || report.vehicle_id);
        return {
            ...report,
            vehicleCode: vehicle ? vehicle.code : report.vehicle_id
        };
    }));
}).subscribe({
    next: (data) => {
        reports.value = data;
        isLoading.value = false;
    },
    error: (err) => {
        console.error('Dexie liveQuery subscription stream encountered an error:', err);
        isLoading.value = false;
    }
});

// Tear down the active database stream when component scope is destroyed
onUnmounted(() => {
    subscription.unsubscribe();
});
</script>

<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center mb-6 pb-2 border-b-2 border-slate-200">
            <h2 class="text-3xl font-black uppercase text-slate-900 tracking-tight">História hlásení</h2>
            <span class="bg-slate-900 text-white px-4 py-2 rounded-2xl text-lg font-black">
                {{ reports.length }}
            </span>
        </div>

        <div v-if="isLoading" class="py-10 text-center text-sm font-black text-slate-400 uppercase tracking-widest">
            Načítavam históriu...
        </div>

        <div v-else-if="reports.length === 0" class="py-20 text-center">
            <div class="text-slate-300 text-6xl mb-4">📋</div>
            <p class="text-slate-500 font-black uppercase text-sm tracking-wide">Žiadne nahlásené poruchy</p>
        </div>

        <div v-else class="space-y-4">
            <div 
                v-for="report in reports" 
                :key="report.id" 
                class="bg-white p-5 rounded-3xl shadow-sm border-b-4 border-slate-300 flex items-center space-x-4"
            >
                <div class="w-24 h-24 bg-slate-100 rounded-2xl shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center">
                    <img 
                        v-if="report.photo" 
                        :src="report.photo" 
                        class="w-full h-full object-cover" 
                        alt="Porucha"
                    >
                    <div v-else class="text-xs font-black text-slate-300 uppercase text-center p-1 leading-tight">
                        Bez<br>fotky
                    </div>
                </div>
                
                <div class="grow min-w-0 flex flex-col justify-between h-24 py-1">
                    <div class="flex justify-between items-start w-full">
                        <div class="flex flex-col">
                            <span class="font-black text-slate-900 uppercase text-2xl leading-none tracking-tight">
                                {{ report.vehicleCode }}
                            </span>
                            <span class="text-[#e30613] font-black text-base uppercase mt-1">
                                Kód: {{ report.category_id }}
                            </span>
                        </div>
                        
                        <div class="text-right flex flex-col items-end shrink-0 pl-2">
                            <span class="text-xs font-black text-slate-900 uppercase">
                                {{ formatDate(report.created_at) }}
                            </span>
                            <span :class="getStatusBadge(report.status).color" class="text-xs font-black uppercase mt-2">
                                ● {{ getStatusBadge(report.status).text }}
                            </span>
                        </div>
                    </div>

                    <div class="text-slate-700 text-sm font-bold min-w-0 w-full mt-1">
                        <span v-if="report.note">{{ getTruncatedNote(report.note) }}</span>
                        <span v-else class="italic opacity-40">Bez poznámky</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>