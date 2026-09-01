<script setup>
    import { FormSection } from '@dpb/app-base-vue';
    import { useI18n } from 'vue-i18n';
    
    const { t } = useI18n();
    const failureReport = defineModel();
</script>

<template>
    <FormSection>
        <div :class="[failureReport.hasFailureType() ? 'opacity-100 cursor-pointer active:bg-slate-50' : 'opacity-50 pointer-events-none']">
            <textarea 
                v-model="failureReport.note"
                rows="2"
                class="w-full p-5 bg-white rounded-3xl border border-slate-200 shadow-sm focus:outline-none font-medium text-slate-700"
                :placeholder="t('report.placeholder')"
            ></textarea>
        </div>
    </FormSection>
</template>