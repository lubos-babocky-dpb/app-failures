<script setup>
    import { FormSection, Modal } from '@dpb/app-base-vue';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import FailureTypePicker from './FailureTypePicker.vue';

    const failureReport = defineModel();
    const failureTypePickerModal = ref(null);

    const { t } = useI18n();

    const openCategoryPicker = () => {
        failureTypePickerModal.value.open();
    }

    const categoryError = ref(null);
</script>

<template>
    <FormSection
        @activate="openCategoryPicker"
    >
            <div 
                :class="[failureReport.hasReportableAsset() ? 'opacity-100 cursor-pointer active:bg-slate-50' : 'opacity-50 pointer-events-none']"
            >
                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    {{ t('report.description') }}
                </label>
                <div 
                    :class="[failureReport.hasFailureType() ? 'bg-slate-100 text-slate-800 border border-slate-200 active:bg-slate-200 normal-case' : 'bg-[#e30613] text-white border border-slate-300 active:bg-[#c40510] uppercase']"
                    class="w-full text-center text-lg font-black tracking-wide py-4 rounded-2xl transition-colors shadow-sm"
                >
                    {{ failureReport.hasFailureType() ? failureReport.failureType.name : t('report.select_failure_btn') }}
                </div>
            </div>

            <div v-if="categoryError" class="text-center text-sm font-black uppercase tracking-wide text-[#e30613] transition-all">
                {{ categoryError }}
            </div>

    </FormSection>
    <Modal
        ref="failureTypePickerModal"
        size="xl"
    >
        <FailureTypePicker
            v-model="failureReport"
            @close="failureTypePickerModal.close()"
        />
    </Modal>
</template>