<script setup>
    import { FailureReport } from '@dpb/failures-ui-vue';
    import { useI18n } from 'vue-i18n';
    import { LocalizedDateFormatter } from '../../formatters/localized-date-formatter';
    import { FailureStatusResolver } from '../../resolvers/failure-status-resolver';
    import { truncate } from '../../utils/string-utils';
    
    const { t } = useI18n();

    const props = defineProps({
        failureReport: {
            type: FailureReport,
            required: true,
        }
    });
</script>

<template>
    <div class="bg-white p-5 rounded-3xl shadow-sm border-b-4 border-slate-300 flex items-center space-x-4">
        <div class="grow min-w-0 flex flex-col justify-between h-24 py-1">
            <div class="flex justify-between items-start w-full">
                <div class="flex flex-col">
                    <span class="font-black text-slate-900 uppercase text-2xl leading-none tracking-tight">
                        {{ failureReport.reportableAsset.code }}
                    </span>
                    <span class="text-[#e30613] font-black text-base uppercase mt-1">
                        {{ failureReport.failureType.name || '---' }}
                    </span>
                </div>
                
                <div class="text-right flex flex-col items-end shrink-0 pl-2">
                    <span class="text-xs font-black text-slate-900 uppercase">
                        {{ LocalizedDateFormatter.format(failureReport.createdAt) }}
                    </span>
                    <span :class="FailureStatusResolver.getBadge(failureReport.status).color" class="text-xs font-black uppercase mt-2">
                        ● {{ t(FailureStatusResolver.getBadge(failureReport.status).labelKey) }}
                    </span>
                </div>
            </div>

            <div class="text-slate-700 text-sm font-bold min-w-0 w-full mt-1">
                <span v-if="failureReport.note">{{ truncate(failureReport.note, 50) }}</span>
                <span v-else class="italic opacity-40">{{ t('history.no_note') }}</span>
            </div>
        </div>
    </div>
</template>