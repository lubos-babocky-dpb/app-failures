<script setup>
    import { FormSection } from '@dpb/app-base-vue';
    import { useI18n } from 'vue-i18n';
    
    const { t } = useI18n();
    const failureReport = defineModel();

    const updateNote = (event) => {
        failureReport.value = failureReport.value.withNote(event.target.value);
    }
</script>

<template>
    <FormSection>
        <div :class="[failureReport.hasFailureType ? 'opacity-100 cursor-pointer active:bg-slate-50' : 'opacity-50 pointer-events-none']">
            <textarea 
                :value="failureReport.note"
                @input="updateNote"
                rows="2"
                class="w-full p-5 bg-white rounded-3xl border border-slate-200 shadow-sm focus:outline-none font-medium text-slate-700"
                :placeholder="t('report.placeholder')"
            ></textarea>
        </div>
    </FormSection>
</template>