<script setup>
    import { failuresUiVue } from '@dpb/failures-ui-vue';
    import { ref, watch } from 'vue';

    const emit = defineEmits(['close']);
    const failureReport = defineModel();
    const failureCategories = ref([]);
    const selectedCategory = ref(null);
    watch(failureCategories, (value) => console.log('FailureCateogries changed: ', value.filter(category => category.parent_uuid === null)));
    const failureTypes = ref([]);
    watch(failureTypes, (value) => console.log('FailureTypes changed: ', value));

    failuresUiVue.failureCategoriesRepository
        .all()
        .then((failureCategoryRecords) => {
            failureCategories.value = failureCategoryRecords;
        });

    failuresUiVue.failureTypesRepository
        .all()
        .then((failureTypeRecords) => {
            failureTypes.value = failureTypeRecords;
        });
    
    const selectFailureType = (failureType) => {
        failureReport.value.failureType = failureType;

        console.log('FailureReport updated: ', failureReport.value);
        emit('close');
    }
</script>

<template>
    <div class="flex flex-col space-y-4 overflow-y-auto pb-12 flex-1">
        <button
            v-if="selectedCategory"
            type="button"
            @click="selectedCategory = failureCategories.find(category => category.uuid === selectedCategory)?.parent_uuid ?? null"
            class="w-full p-5 text-xl font-black uppercase tracking-wide bg-[#e30613] text-white rounded-2xl mb-2 active:bg-[#c40510] shadow-md shrink-0"
        >
            ← Späť
        </button>

        <button
            v-for="failureCategory in failureCategories.filter(failureCategory => failureCategory.parent_uuid === selectedCategory)"
            :key="failureCategory.uuid"
            type="button"
            @click="selectedCategory = failureCategory.uuid"
            class="w-full flex items-center justify-between p-6 bg-white border-2 border-[#e30613] rounded-2xl text-left active:bg-slate-100 shadow-sm shrink-0 min-h-[90px]"
        >
            <span class="text-slate-900 font-black text-2xl uppercase tracking-wide pr-2 leading-tight">
                {{ failureCategory.name }}
            </span>

            <span class="text-[#e30613] font-black text-3xl shrink-0">
                ➔
            </span>
        </button>

        <!-- Failure Types -->
        <button
            v-for="failureType in failureTypes.filter(failureType => failureType.categoryUuid === selectedCategory)"
            :key="failureType.uuid"
            type="button"
            @click="selectFailureType(failureType)"
            class="w-full flex justify-between items-center p-6 bg-white border-2 border-[#e30613] rounded-2xl text-left active:bg-slate-100 shadow-sm shrink-0 min-h-[90px]"
        >
            <div class="text-slate-900 font-black text-2xl uppercase pr-4 leading-tight">
                {{ failureType.name }}
            </div>

            <div class="font-black bg-slate-900 text-white px-5 py-3 rounded-xl text-2xl tracking-wide shrink-0 shadow-inner">
                {{ failureType.code }}
            </div>
        </button>

    </div>
</template>