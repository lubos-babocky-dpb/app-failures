<script setup>
    import { FormSection, Modal, Button } from '@dpb/app-base-vue';
    import { nextTick, ref } from 'vue';
    import { ReportableAssetQrScanner } from '../../../scanner/reportable-asset-qr-scanner';
    import { useI18n } from 'vue-i18n';
    import ReportableAssetInfoBox from './ReportableAssetInfoBox.vue';
    import { failuresUiVue } from '@dpb/failures-ui-vue';

    const failureReport = defineModel();
    const { t } = useI18n();
    const qrScannerModal = ref(null);
    let qrScanner = null;

    const startQrScanner = () => {
        qrScannerModal.value.open();

        nextTick(() => {
            qrScanner = new ReportableAssetQrScanner('qr-reader');
            qrScanner.scan()
                .then((qrCodeContent) => {
                    const reportableAssetId = Number(extractReportableAssetId(qrCodeContent));
                    failuresUiVue.reportableAssetsRepository
                        .get(reportableAssetId)
                        .then((reportableAssetData) => {
                            failureReport.value.reportableAsset = reportableAssetData;
                            qrScannerModal.value.close();
                        })
                })
                .catch((error) => {
                    console.error(error);
                    qrScannerModal.value.close();
                });
        });
    };

    const stopQrScanner = async () => {
        await qrScanner?.stop();
        qrScanner = null;
    };

    const extractReportableAssetId = (text) => {
        try {
            const url = new URL(text);
            return url.searchParams.get('vehicleId')
                || url.pathname.split('/').filter(Boolean).pop()
                || text;
        } catch {
            return text;
        }
    };
</script>

<template>
    <FormSection
        @activate="startQrScanner"
        :class="[failureReport.hasReportableAsset() ? 'justify-between' : 'justify-center cursor-pointer active:bg-slate-50']"
    >
        <ReportableAssetInfoBox v-if="failureReport.hasReportableAsset()" v-model="failureReport" />

        <Button :variant="failureReport.hasReportableAsset() && !failureReport.error ? 'secondary' : 'primary'">
            {{ failureReport.hasReportableAsset() ? t('report.load_again') : t('report.select_vehicle') }}
        </Button>
    </FormSection>
    
    <Modal
        ref="qrScannerModal"
        size="sm"
        content-padding="none"
        @close="stopQrScanner"
    >
        <div id="qr-reader" class="w-full"></div>
    </Modal>
</template>