<script setup>
    import { FailureReport, failuresUiVue } from '@dpb/failures-ui-vue';
    import { onMounted, onUnmounted, ref } from 'vue';
    import ListItem from '../components/failure-history/ListItem.vue';
    import { Modal } from '@dpb/app-base-vue';
    import FailureReportDetail from '../components/failure-history/FailureReportDetail.vue';
    import { useRoute } from 'vue-router';

    const route = useRoute();
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

        const uuid = route.params.uuid;
        if(uuid) {
            failuresUiVue.failureReportsRepository
                .get(uuid)
                .then((failureReport) => {
                    if(failureReport instanceof FailureReport) {
                        showDetail(failureReport);
                    }
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