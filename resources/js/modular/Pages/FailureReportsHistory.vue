<script setup>
    import { failuresUiVue } from '@dpb/failures-ui-vue';
    import { onMounted, onUnmounted, ref } from 'vue';
    import ListItem from '../components/failure-history/ListItem.vue';
    import { Modal } from '@dpb/app-base-vue';
import FailureReportDetail from '../components/failure-history/FailureReportDetail.vue';

    const failureReports = ref([]);
    const detailModal = ref(null);
    const selectedFailureReport = ref(null);
    let subscription;

    const showDetail = (failureReport) => {
        selectedFailureReport.value = failureReport;
        detailModal.value.open();
    };

    onMounted(() => {
        subscription = failuresUiVue.failureReportsRepository
            .live()
            .subscribe(reports => {
                failureReports.value = reports;
            });
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