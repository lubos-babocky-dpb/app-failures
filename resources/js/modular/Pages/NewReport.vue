<script setup>
import { ref, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Html5Qrcode } from 'html5-qrcode';
import { syncPendingFailures } from '../sync';
import { failuresUiVue } from '@dpb/failures-ui-vue';

const { t } = useI18n();

// Form States
const vehicleId = ref('');
const vehicleData = ref(null);
const selectedFailure = ref(null);
const note = ref('');
const photoPreview = ref('');
const isSubmitting = ref(false);
const isSuccess = ref(false);

// Template Refs for avoiding document.getElementById
const fileInput = ref(null);

// Modals States
const isQrModalOpen = ref(false);
const isCategoryModalOpen = ref(false);
const categoryError = ref('');
let errorTimeout = null;

// QR Scanner Instance
let html5QrCode = null;

// Category Picker Navigation States
const categoriesList = ref([]);
const currentSubcategories = ref([]);
const currentFailures = ref([]);
const activeCategoryName = ref('');

const triggerPhotoUpload = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const cleanVehicleId = (text) => {
    try {
        const url = new URL(text);
        return url.searchParams.get('vehicleId') || url.pathname.split('/').filter(Boolean).pop() || text;
    } catch (e) {
        return text;
    }
};

const startQrScanner = async () => {
    isQrModalOpen.value = true;
    categoryError.value = '';
    
    setTimeout(async () => {
        html5QrCode = new Html5Qrcode('qr-reader');
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        };

        try {
            await html5QrCode.start(
                { facingMode: 'environment' },
                config,
                (decodedText) => {
                    handleVehicleSelection(cleanVehicleId(decodedText));
                    stopQrScanner();
                }
            );
        } catch (err) {
            console.error(err);
            stopQrScanner();
        }
    }, 50);
};

const stopQrScanner = async () => {
    if (html5QrCode && html5QrCode.isScanning) {
        await html5QrCode.stop();
    }
    isQrModalOpen.value = false;
};

const handleVehicleSelection = async (scannedId) => {
    const idToFind = Number(scannedId) || scannedId;
    vehicleData.value = { loading: true };
    categoryError.value = '';

    if (errorTimeout) {
        clearTimeout(errorTimeout);
    }

    const reportable = await failuresUiVue
        .reportableAssetsRepository
        .get(idToFind);

    if (reportable) {
        vehicleId.value = reportable.id;
        vehicleData.value = reportable;

        return;
    }

    vehicleId.value = '';
    vehicleData.value = {
        error: true,
        code: idToFind
    };

    selectedFailure.value = null;
};

const openCategoryPicker = async () => {
    // Prevent opening if no vehicle is scanned or if the active vehicle has an error state
    if (!vehicleId.value || (vehicleData.value && vehicleData.value.error)) {
        categoryError.value = t('report.error_scan_first');
        if (errorTimeout) clearTimeout(errorTimeout);
        errorTimeout = setTimeout(() => categoryError.value = '', 3000);
        return;
    }

    try {
        // Fetch all failure categories directly from local IndexedDB storage
        const allCategories = await failuresUiVue.failureCategoriesRepository.all();

        // Map internal descriptive types to short identifiers used in the business logic
        const typeMap = { 'Autobus': 'A', 'Električka': 'E', 'Trolejbus': 'T' };
        const vehicleType = typeMap[vehicleData.value.type.name] || 'A';

        // Filter the category tree on the client side based on the active vehicle's type
        categoriesList.value = allCategories;
        
        // Reset modal navigation back to the root level view
        currentSubcategories.value = [];
        currentFailures.value = [];
        isCategoryModalOpen.value = true;
    } catch (error) {
        console.error('Failed to query local failure categories:', error);
    }
};

const selectCategory = (category) => {
    activeCategoryName.value = category.name;
    currentSubcategories.value = category.subcategories;
};

const selectSubcategory = (subcategory) => {
    currentFailures.value = subcategory.failures;
};

const selectFailure = (failure, subcategoryName) => {
    selectedFailure.value = {
        code: failure.code,
        displayName: `${subcategoryName}: ${failure.name}`
    };
    isCategoryModalOpen.value = false;
};

const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            // Convert file stream to base64 string for persistent offline database storage
            photoPreview.value = reader.result;
        };
        reader.readAsDataURL(file);
    }
};

const removePhoto = () => {
    if (photoPreview.value.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview.value);
    }
    photoPreview.value = '';
};

const submitReport = async () => {
    if (!vehicleId.value || !selectedFailure.value) return;

    isSubmitting.value = true;

    try {
        // 1. Explicitly await the local IndexedDB write operation first
        await db.failures.add({
            uuid: crypto.randomUUID(), // Injected: Required primary key value for IndexedDB schema
            vehicle_id: Number(vehicleId.value) || vehicleId.value,
            category_id: selectedFailure.value.code,
            note: note.value,
            photo: photoPreview.value || null,
            status: 'pending_sync',
            created_at: new Date().toISOString()
        });

        console.log('[FORM-CONTEXT] Local write successful. Triggering background sync execution...');

        // 2. Execute the sync process inside a completely detached async microtask
        // This prevents Vue's reactive state changes from killing the fetch process
        setTimeout(async () => {
            console.log('[FORM-CONTEXT] Detached microtask macro-queue firing syncPendingFailures()...');
            await syncPendingFailures();
        }, 10);

        // 3. Switch view layer state to success screen
        isSuccess.value = true;

    } catch (error) {
        console.error('Failed to process form submission sequence:', error);
    } finally {
        isSubmitting.value = false;
    }
};

const resetForm = () => {
    vehicleId.value = '';
    vehicleData.value = null;
    selectedFailure.value = null;
    note.value = '';
    photoPreview.value = '';
    isSuccess.value = false;
};

onUnmounted(() => {
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop();
    }
});
</script>

<template>
    <div v-if="isSuccess" class="flex flex-col items-center justify-center space-y-6 py-20 animate-[fadeIn_0.3s_ease-in-out]">
        <div class="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl font-sans">
            ✓
        </div>
        <div class="text-center space-y-2">
            <h2 class="text-2xl font-black uppercase text-slate-800">{{ t('report.accepted') }}</h2>
            <p class="text-slate-500 font-medium">{{ t('report.success_sub') }}</p>
        </div>
        <button type="button" @click="resetForm" class="px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl uppercase tracking-widest text-sm transition-transform active:scale-95">
            {{ t('nav.new_report') }}
        </button>
    </div>

    <form v-else @submit.prevent="submitReport" class="space-y-4">
        
        <div 
            @click="vehicleData ? null : startQrScanner()" 
            :class="[vehicleData ? 'justify-between' : 'justify-center cursor-pointer active:bg-slate-50']"
            class="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 transition-colors flex flex-col min-h-[140px]"
        >
            <div v-if="vehicleData" class="flex-1 flex flex-col justify-center min-h-[110px] mb-3">
                <div v-if="vehicleData.loading" class="text-lg font-bold text-slate-400 uppercase tracking-wide">...</div>
                <div v-else-if="vehicleData.error" class="flex flex-col justify-center">
                    <div class="flex justify-between items-baseline w-full">
                        <div class="text-5xl font-black text-slate-900 leading-none tracking-tight">{{ vehicleData.code }}</div>
                        <div class="text-xl font-black text-[#e30613] uppercase leading-none text-right pl-2">{{ t('report.unknown_vehicle') }}</div>
                    </div>
                </div>
                <div v-else class="flex flex-col justify-center">
                    <div class="flex justify-between items-baseline w-full">
                        <div class="text-5xl font-black text-slate-900 leading-none tracking-tight">{{ vehicleData.code }}</div>
                        <div class="text-xl font-black text-slate-500 uppercase leading-none text-right pl-2">{{ vehicleData.type.name }}</div>
                    </div>
                    <div class="text-lg font-bold text-slate-400 uppercase tracking-wide mt-2">{{ vehicleData.model.name }}</div>
                </div>
            </div>

            <div class="w-full">
                <button 
                    type="button"
                    @click.stop="startQrScanner"
                    :class="[vehicleData && !vehicleData.error ? 'bg-slate-100 text-slate-500 border border-slate-200 active:bg-slate-200' : 'bg-[#e30613] text-white border border-slate-300 active:bg-[#c40510]']"
                    class="w-full text-center text-lg font-black uppercase tracking-wide py-4 rounded-2xl transition-colors shadow-sm"
                >
                    {{ vehicleData ? t('report.load_again') : t('report.select_vehicle') }}
                </button>
            </div>
        </div>

        <div class="space-y-2">
            <div 
                @click="openCategoryPicker"
                :class="[vehicleId && (!vehicleData || !vehicleData.error) ? 'opacity-100 cursor-pointer active:bg-slate-50' : 'opacity-50 pointer-events-none']"
                class="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 transition-opacity duration-300"
            >
                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    {{ t('report.description') }}
                </label>
                <div 
                    :class="[selectedFailure ? 'bg-slate-100 text-slate-800 border border-slate-200 active:bg-slate-200 normal-case' : 'bg-[#e30613] text-white border border-slate-300 active:bg-[#c40510] uppercase']"
                    class="w-full text-center text-lg font-black tracking-wide py-4 rounded-2xl transition-colors shadow-sm"
                >
                    {{ selectedFailure ? selectedFailure.displayName : t('report.select_failure_btn') }}
                </div>
            </div>

            <div v-if="categoryError" class="text-center text-sm font-black uppercase tracking-wide text-[#e30613] transition-all">
                {{ categoryError }}
            </div>
        </div>

        <div 
            :class="[selectedFailure ? 'opacity-100' : 'opacity-50 pointer-events-none']" 
            class="space-y-3 transition-opacity duration-300"
        >
            <textarea 
                v-model="note" 
                rows="2"
                class="w-full p-5 bg-white rounded-3xl border border-slate-200 shadow-sm focus:outline-none font-medium text-slate-700"
                :placeholder="t('report.placeholder')"
            ></textarea>

            <div class="relative">
                <input 
                    type="file" 
                    ref="fileInput"
                    accept="image/*" 
                    capture="environment" 
                    @change="handlePhotoChange" 
                    class="hidden"
                >

                <button 
                    v-if="!photoPreview"
                    type="button" 
                    @click="triggerPhotoUpload"
                    class="w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 flex items-center justify-center space-x-2 active:bg-slate-50"
                >
                    <span>📸</span>
                    <span class="text-[10px] font-black uppercase tracking-widest">{{ t('report.add_photo') }}</span>
                </button>

                <div v-else class="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                    <img :src="photoPreview" alt="Náhľad poruchy" class="w-full max-h-[250px] object-cover">
                    <button 
                        type="button" 
                        @click="removePhoto"
                        class="absolute top-3 right-3 w-12 h-12 bg-[#e30613] text-white font-black text-xl rounded-full flex items-center justify-center shadow-lg backdrop-blur-md active:bg-[#c40510]"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>

        <button 
            v-if="selectedFailure"
            type="submit" 
            :disabled="isSubmitting"
            :class="[isSubmitting ? 'opacity-70' : '']"
            class="w-full py-5 bg-[#e30613] text-white font-black text-xl rounded-3xl shadow-xl active:scale-[0.97] transition-all uppercase tracking-widest"
        >
            {{ isSubmitting ? '...' : t('report.submit') }}
        </button>

        <div v-if="isQrModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div class="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div id="qr-reader" class="w-full"></div>
                <button 
                    type="button" 
                    @click="stopQrScanner"
                    class="absolute top-4 right-4 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-md"
                >
                    ✕
                </button>
            </div>
        </div>

        <div v-if="isCategoryModalOpen" class="fixed inset-0 z-[60] bg-white p-4 flex flex-col overflow-hidden">
            <div class="flex justify-between items-center pb-4 mb-4 border-b-4 border-[#e30613] shrink-0">
                <h2 class="text-slate-900 text-2xl font-black uppercase tracking-wide">{{ t('report.modal_title') }}</h2>
                <button 
                    type="button" 
                    @click="isCategoryModalOpen = false" 
                    class="bg-[#e30613] text-white font-black text-xl rounded-2xl w-14 h-14 flex items-center justify-center active:bg-[#c40510] shrink-0"
                >
                    ✕
                </button>
            </div>
            
            <div class="flex flex-col space-y-4 overflow-y-auto pb-12 flex-1">
                <template v-if="currentSubcategories.length === 0">
                    <button 
                        v-for="cat in categoriesList" 
                        :key="cat.id" 
                        type="button"
                        @click="selectCategory(cat)"
                        class="w-full flex items-center justify-between p-6 bg-white border-2 border-[#e30613] rounded-2xl text-left active:bg-slate-100 shadow-sm shrink-0 min-h-[90px]"
                    >
                        <span class="text-slate-900 font-black text-2xl uppercase tracking-wide pr-2 leading-tight">[{{ cat.id }}] {{ cat.name }}</span>
                        <span class="text-[#e30613] font-black text-3xl shrink-0">➔</span>
                    </button>
                </template>

                <template v-else-if="currentFailures.length === 0">
                    <button 
                        type="button" 
                        @click="currentSubcategories = []" 
                        class="w-full p-5 text-xl font-black uppercase tracking-wide bg-[#e30613] text-white rounded-2xl mb-2 active:bg-[#c40510] shadow-md shrink-0"
                    >
                        {{ t('report.back') }}
                    </button>
                    <button 
                        v-for="sub in currentSubcategories" 
                        :key="sub.name" 
                        type="button"
                        @click="selectSubcategory(sub)"
                        class="w-full flex items-center justify-between p-6 bg-white border-2 border-[#e30613] rounded-2xl text-left active:bg-slate-100 shadow-sm shrink-0 min-h-[90px]"
                    >
                        <span class="text-slate-900 font-black text-2xl uppercase tracking-wide pr-2 leading-tight">{{ sub.name }}</span>
                        <span class="text-[#e30613] font-black text-3xl shrink-0">➔</span>
                    </button>
                </template>

                <template v-else>
                    <button 
                        type="button" 
                        @click="currentFailures = []" 
                        class="w-full p-5 text-xl font-black uppercase tracking-wide bg-[#e30613] text-white rounded-2xl mb-2 active:bg-[#c40510] shadow-md shrink-0 leading-tight"
                    >
                        {{ t('report.back') }}
                    </button>
                    <button 
                        v-for="fail in currentFailures" 
                        :key="fail.code" 
                        type="button"
                        @click="selectFailure(fail, activeCategoryName)"
                        class="w-full flex justify-between items-center p-6 bg-white border-2 border-[#e30613] rounded-2xl text-left active:bg-slate-100 shadow-sm shrink-0 min-h-[90px]"
                    >
                        <div class="text-slate-900 font-black text-2xl uppercase pr-4 leading-tight">{{ fail.name }}</div>
                        <div class="font-black bg-slate-900 text-white px-5 py-3 rounded-xl text-2xl tracking-wide shrink-0 shadow-inner">{{ fail.code }}</div>
                    </button>
                </template>
            </div>
        </div>
    </form>
</template>