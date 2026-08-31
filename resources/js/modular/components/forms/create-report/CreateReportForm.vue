<script setup>
    import { ref } from "vue";
    import ReportableAssetSelector from "./ReportableAssetSelector.vue";
    import FailureTypeSelector from "./FailureTypeSelector.vue";
    import { FailureReport } from "@dpb/failures-ui-vue";
    const failureReport = ref(FailureReport.prepareNewFailureReport());
</script>

<template>
    <div class="flex flex-col gap-2">
        <ReportableAssetSelector v-model="failureReport" />
        <FailureTypeSelector v-model="failureReport" />
    </div>
</template>