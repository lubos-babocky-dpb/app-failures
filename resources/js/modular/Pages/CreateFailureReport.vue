<script setup>
    import { onMounted, ref, shallowRef } from "vue";
    import { Button, Modal } from "@dpb/app-base-vue";
    import { FailureReport, failuresModule } from "@dpb/failures-core";
    import { FailureTypeSelector, NoteBox, PhotoBox, ReportableAssetSelector } from "../components/forms/create-report";
    import router from '../router.js';

    const debug = true;

    const failureReport = shallowRef(FailureReport.prepareNewFailureReport());
    const failureReportCreatedModal = ref(null);

    const submitNewFailureReport = () => failuresModule
            .createFailureReport(failureReport.value)
            .then(() => {
                failureReport.value = FailureReport.prepareNewFailureReport();
                failureReportCreatedModal.value.open();
            });

    const goToFailureHistory = () => router.push('/history');

    //[L:] temp
    onMounted(() => {
        if(debug) {
            failuresModule.findReportableAsset('58663019-9aef-11f1-83a3-0050568c1053')
                .then(reportableAsset => failureReport.value = failureReport.value.withReportableAsset(reportableAsset));
            failuresModule.findFailureType('089605f1-d8ff-462e-9bf0-a286b836b610')
                .then(failureType => failureReport.value = failureReport.value.withFailureType(failureType));
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
            :disabled="!failureReport.hasFailureTypeAndReportableAsset"
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