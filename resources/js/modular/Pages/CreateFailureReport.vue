<script setup>
    import { onMounted, ref } from "vue";
    import FailureTypeSelector from '../components/forms/create-report/FailureTypeSelector.vue';
    import NoteBox from '../components/forms/create-report/NoteBox.vue';
    import PhotoBox from '../components/forms/create-report/PhotoBox.vue';
    import ReportableAssetSelector from '../components/forms/create-report/ReportableAssetSelector.vue';
    import { FailureReport, failuresUiVue } from "@dpb/failures-ui-vue";
    import { Button, Modal } from "@dpb/app-base-vue";
    import router from '../router.js';

    const debug = true;
    const failureReport = ref(FailureReport.prepareNewFailureReport());
    const failureReportCreatedModal = ref(null);

    const submitNewFailureReport = () => {
        failuresUiVue.failureReportsRepository
            .save(failureReport.value)
            .then(() => {
                failureReport.value = FailureReport.prepareNewFailureReport();
                failureReportCreatedModal.value.open();
            });
    };

    const goToFailureHistory = () => {
        router.push('/history');
    };

    //[L:] temp
    onMounted(() => {
        if(debug) {
            failuresUiVue.reportableAssetsRepository.get(11).then((reportableAsset) => {
                failureReport.value.reportableAsset = reportableAsset;
            });
            failuresUiVue.failureTypesRepository.get('a3e77725-3d50-4422-a4de-c9fd9f66dcfa').then((failureType) => {
                failureReport.value.failureType = failureType;
            });
        }
    });
</script>

<template>
    <div class="flex flex-col gap-2">
        <ReportableAssetSelector v-model="failureReport" />
        <FailureTypeSelector v-model="failureReport" />
        <NoteBox v-model="failureReport" />
        <PhotoBox v-model="failureReport" />
        <Button
            :disabled="!failureReport.hasFailureTypeAndReportableAsset()"
            @click="submitNewFailureReport"
        >
            submit
        </Button>
    </div>
    <Modal ref="failureReportCreatedModal">
        <div>
            <h1>Hlásenie bolo vytvorené</h1>
            <div class="flex">
                <Button @click="failureReportCreatedModal.close()">Nové hlásenie</Button>
                <Button @click="goToFailureHistory">História hlásení</Button>
            </div>
        </div>
    </Modal>
</template>