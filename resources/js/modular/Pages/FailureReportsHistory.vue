<script setup>
    import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
    import ListItem from '../components/failure-history/ListItem.vue';
    import { Modal } from '@dpb/app-base-vue';
    import FailureReportDetail from '../components/failure-history/FailureReportDetail.vue';
    import { useRoute } from 'vue-router';
    import { failuresModule } from '@dpb/failures-core';

    const route = useRoute();
    const failureReports = shallowRef([]);
    const detailModal = ref(null);
    const selectedFailureReport = shallowRef(null);
    let subscription;

    const showDetail = (failureReport) => {
        selectedFailureReport.value = failureReport;
        detailModal.value.open();
    };

    onMounted(() => {
        subscription = failuresModule.failureReportsWatcher
            .subscribe(reports => {
                failureReports.value = reports;
            });

        const uuid = route.params.uuid;
        if(uuid) {
            failuresModule.findFailureReport(uuid)
                .then((failureReport) => {
                    showDetail(failureReport);
                });
        }
    });

    onUnmounted(() => {
        subscription.unsubscribe();
    });
</script>

<template>
    <div v-for="failureReport in failureReports" :key="failureReport.uuid">
        <ListItem :failure-report="failureReport" @click="showDetail(failureReport)" />
    </div>
    <Modal
        ref="detailModal"
        size="lg"
        @close="selectedFailureReport = null"
    >
        <FailureReportDetail
            v-if="selectedFailureReport"
            :failure-report="selectedFailureReport"
        />
    </Modal>
</template>