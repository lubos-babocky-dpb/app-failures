<script setup>
    import { FailureReport } from '@dpb/failures-ui-vue';
    import { useI18n } from 'vue-i18n';
import { LocalizedDateFormatter } from '../../formatters/localized-date-formatter';
import { FailureStatusResolver } from '../../resolvers/failure-status-resolver';
    const { t } = useI18n();

    const props = defineProps({
        failureReport: {
            type: FailureReport,
            required: true,
        }
    });
</script>

<template>
    <div class="space-y-6">
        <div class="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-slate-300 space-y-6">
            <div class="flex justify-between items-start border-b pb-4 border-slate-100">
                <div>
                    <span class="font-black text-slate-900 uppercase text-3xl leading-none tracking-tight block">
                        {{ failureReport.reportableAsset.code }}
                    </span>
                    <span class="text-[#e30613] font-black text-base uppercase block mt-1">
                        {{ failureReport.failureType.name }}
                    </span>
                </div>
                <div class="text-right">
                    <span class="text-xs font-black text-slate-900 uppercase block">
                        {{ LocalizedDateFormatter.format(failureReport.createdAt) }}
                        
                    </span>
                    <span :class="FailureStatusResolver.getBadge(failureReport.status).color" class="text-xs font-black uppercase mt-2">
                        ● {{ t(FailureStatusResolver.getBadge(failureReport.status).labelKey) }}
                    </span>
                </div>
            </div>

            <div
                v-if="failureReport.photos.length"
                class="overflow-hidden"
            >
                <div class="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-2">
                    <div
                        v-for="(photo, key) of failureReport.photos"
                        :key="key"
                        class="w-full h-full shrink-0 snap-start"
                    >
                        <img
                            :src="photo"
                            class="w-full h-full object-cover rounded-2xl"
                        />
                    </div>
                </div>
            </div>

            <div class="space-y-1">
                <span class="text-xs font-black text-slate-400 uppercase block">Poznámka vodiča</span>
                <div class="text-slate-800 text-base font-bold bg-slate-50 p-4 rounded-2xl border border-slate-200 whitespace-pre-line">
                    <span v-if="failureReport.note">
                        {{ failureReport.note }}
                    </span>
                    <span v-else class="italic opacity-40 font-normal">
                        {{ t('history.no_note') }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>