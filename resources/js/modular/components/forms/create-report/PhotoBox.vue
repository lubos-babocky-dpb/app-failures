<script setup>
    import { FormSection, Modal } from '@dpb/app-base-vue';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';

    const { t } = useI18n();
    const failureReport = defineModel();
    const fileInput = ref(null);
    const handlePhotoChange = (element) => {
        const file = element.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                failureReport.value.attachPhoto(reader.result);
            }
            reader.readAsDataURL(file);
        }
    };

    const triggerPhotoUpload = () => {
        if (fileInput.value) {
            fileInput.value.click();
        }
    };
</script>

<template>
    <FormSection>
        <input 
            type="file" 
            ref="fileInput"
            accept="image/*" 
            capture="environment" 
            @change="handlePhotoChange" 
            class="hidden"
        >

        <button 
            type="button" 
            @click="triggerPhotoUpload"
            class="w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 flex items-center justify-center space-x-2 active:bg-slate-50"
        >
            <span>📸</span>
            <span class="text-[10px] font-black uppercase tracking-widest">
                {{ t('report.add_photo') }}
            </span>
        </button>

        <div
            v-if="failureReport.photos.length"
            class="overflow-hidden"
        >
            <div class="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-2">
                <div
                    v-for="(photo, key) of failureReport.photos"
                    :key="key"
                    class="w-24 h-24 shrink-0 snap-start"
                >
                    <img
                        :src="photo"
                        class="w-full h-full object-cover rounded-2xl"
                    />
                </div>
            </div>
        </div>
    </FormSection>
    <Modal
        ref="imagePreviewModal"
        size="xl"
    >

    image preview
    </Modal>
</template>