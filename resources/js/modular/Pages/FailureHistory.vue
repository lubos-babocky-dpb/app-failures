<script setup>
import { ref, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { liveQuery } from 'dexie';
import { db } from '../db';
import { useRouter } from 'vue-router';
import { LocalizedDateFormatter } from '../formatters/localized-date-formatter';
import { FailureStatusResolver } from '../resolvers/failure-status-resolver';
import { truncate } from '../utils/string-utils';
import { failureRepository } from '../repositories/failure-repository';

const { t, locale } = useI18n();
const reports = ref([]);
const isLoading = ref(true);
const router = useRouter();

// Create a real-time reactive database subscription using Dexie liveQuery
const subscription = failureRepository.live().subscribe({
    next: (data) => {
        reports.value = data;
        isLoading.value = false;
    },
    error: (error) => {
        console.error('Dexie liveQuery error:', error);
        isLoading.value = false;
    }
})

// Tear down the active database stream when component scope is destroyed
onUnmounted(() => {
    subscription.unsubscribe();
});
</script>

<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center mb-6 pb-2 border-b-2 border-slate-200">
            <h2 class="text-3xl font-black uppercase text-slate-900 tracking-tight">{{ t('history.title') }}</h2>
            <span class="bg-slate-900 text-white px-4 py-2 rounded-2xl text-lg font-black">
                {{ reports.length }}
            </span>
        </div>

        <div v-if="isLoading" class="py-10 text-center text-sm font-black text-slate-400 uppercase tracking-widest">
            {{ t('history.loading') }}
        </div>

        <div v-else-if="reports.length === 0" class="py-20 text-center">
            <div class="text-slate-300 text-6xl mb-4">📋</div>
            <p class="text-slate-500 font-black uppercase text-sm tracking-wide">{{ t('history.empty') }}</p>
        </div>

        <div v-else class="space-y-4">
            <div 
                v-for="report in reports" 
                :key="report.uuid"
                @click="router.push('/history/detail/' + report.uuid)"
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
                        {{ t('history.no_photo') }}
                    </div>
                </div>
                
                <div class="grow min-w-0 flex flex-col justify-between h-24 py-1">
                    <div class="flex justify-between items-start w-full">
                        <div class="flex flex-col">
                            <span class="font-black text-slate-900 uppercase text-2xl leading-none tracking-tight">
                                {{ report.vehicleCode }}
                            </span>
                            <span class="text-[#e30613] font-black text-base uppercase mt-1">
                                {{ t('history.code_label') }}: {{ report.category_id || '---' }}
                            </span>
                        </div>
                        
                        <div class="text-right flex flex-col items-end shrink-0 pl-2">
                            <span class="text-xs font-black text-slate-900 uppercase">
                                {{ LocalizedDateFormatter.format(report.created_at) }}
                            </span>
                            <span :class="FailureStatusResolver.getBadge(report.status).color" class="text-xs font-black uppercase mt-2">
                                ● {{ t(FailureStatusResolver.getBadge(report.status).labelKey) }}
                            </span>
                        </div>
                    </div>

                    <div class="text-slate-700 text-sm font-bold min-w-0 w-full mt-1">
                        <span v-if="report.note">{{ truncate(report.note, 50) }}</span>
                        <span v-else class="italic opacity-40">{{ t('history.no_note') }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>