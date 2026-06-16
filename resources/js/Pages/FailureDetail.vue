<script setup>
    import { ref, onMounted } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { useRouter, useRoute } from 'vue-router';
    import { db } from '../db';

    const { t, locale } = useI18n();
    const router = useRouter();
    const route = useRoute();

    const report = ref(null);
    const isLoading = ref(true);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        const currentLocale = locale.value === 'sk' ? 'sk-SK' : (locale.value === 'ru' ? 'ru-RU' : 'en-US');
        return d.toLocaleDateString(currentLocale) + ' ' + d.toLocaleTimeString(currentLocale, { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending_sync': { text: t('status.pending_sync'), color: 'text-amber-600 animate-pulse' },
            'synced': { text: t('status.synced'), color: 'text-green-600' },
            'reported': { text: t('status.reported'), color: 'text-[#e30613]' },
            'accepted': { text: t('status.accepted'), color: 'text-blue-600' },
            'resolved': { text: t('status.resolved'), color: 'text-gray-500' }
        };
        return statusMap[status] || { text: t('status.reported'), color: 'text-[#e30613]' };
    };

    onMounted(async () => {
        try {
            const uuid = route.params.uuid;
            const localRecord = await db.failures.get(uuid);
            
            if (localRecord) {
                const vehicle = await db.vehicles.get(Number(localRecord.vehicle_id) || localRecord.vehicle_id);
                report.value = {
                    ...localRecord,
                    vehicleCode: vehicle ? vehicle.code : localRecord.vehicle_id
                };
            }
        } catch (err) {
            console.error('Chyba pri načítaní detailu z Dexie:', err);
        } finally {
            isLoading.value = false;
        }
    });
</script>

<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center mb-6 pb-2 border-b-2 border-slate-200">
            <button @click="router.push('/history')" class="bg-slate-900 text-white px-4 py-2 rounded-2xl text-sm font-black uppercase tracking-tight">
                ← {{ t('nav.history') }}
            </button>
            <h2 class="text-xl font-black uppercase text-slate-900 tracking-tight">Detail poruchy</h2>
        </div>

        <div v-if="isLoading" class="py-10 text-center text-sm font-black text-slate-400 uppercase tracking-widest">
            {{ t('history.loading') }}
        </div>

        <div v-else-if="!report" class="py-20 text-center">
            <div class="text-slate-300 text-6xl mb-4">⚠️</div>
            <p class="text-slate-500 font-black uppercase text-sm tracking-wide">Porucha neexistuje</p>
        </div>

        <div v-else class="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-slate-300 space-y-6">
            <div class="flex justify-between items-start border-b pb-4 border-slate-100">
                <div>
                    <span class="font-black text-slate-900 uppercase text-3xl leading-none tracking-tight block">
                        {{ report.vehicleCode }}
                    </span>
                    <span class="text-[#e30613] font-black text-base uppercase block mt-1">
                        {{ t('history.code_label') }} : {{ report.category_id }}
                    </span>
                </div>
                <div class="text-right">
                    <span class="text-xs font-black text-slate-900 uppercase block">
                        {{ formatDate(report.created_at) }}
                    </span>
                    <span :class="getStatusBadge(report.status).color" class="text-xs font-black uppercase block mt-2">
                        ● {{ getStatusBadge(report.status).text }}
                    </span>
                </div>
            </div>

            <div v-if="report.photo" class="w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                <img :src="report.photo" class="w-full h-full object-cover" alt="Foto">
            </div>

            <div class="space-y-1">
                <span class="text-xs font-black text-slate-400 uppercase block">Poznámka vodiča</span>
                <div class="text-slate-800 text-base font-bold bg-slate-50 p-4 rounded-2xl border border-slate-200 whitespace-pre-line">
                    <span v-if="report.note">{{ report.note }}</span>
                    <span v-else class="italic opacity-40 font-normal">{{ t('history.no_note') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>