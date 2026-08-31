<script setup>
    import { ref, computed, onMounted, onUnmounted } from 'vue';
    import QRCode from 'qrcode';
    import { failuresUiVue } from '@dpb/failures-ui-vue';

    const reportableAssets = ref([]);
    const search = ref('');

    const qrCode = ref(null);
    const selectedReportable = ref(null);
    const isQrModalOpen = ref(false);

    let subscription;

    const filteredReportableAssets = computed(() => {
        const query = search.value.trim().toLowerCase();

        if (!query) {
            return reportableAssets.value;
        }

        return reportableAssets.value.filter(reportable => {
            return [
                reportable.code,
                reportable.model?.name,
            ]
                .filter(Boolean)
                .some(value => value.toLowerCase().includes(query));
        });
    });

    const showQrCode = async (reportable) => {
        const url = `https://localhost?vehicleId=${encodeURIComponent(reportable.id)}`;
        selectedReportable.value = reportable;
        qrCode.value = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
        });
        isQrModalOpen.value = true;
    };

    const closeQrModal = () => {
        isQrModalOpen.value = false;
        qrCode.value = null;
        selectedReportable.value = null;
    };

    const downloadQrCode = () => {
        if (!qrCode.value) {
            return;
        }

        const link = document.createElement('a');

        link.href = qrCode.value;
        link.download = `vehicle-${selectedReportable.value?.code ?? selectedReportable.value?.id}-qr-code.png`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const printQrCode = () => {
        if (!qrCode.value) {
            return;
        }

        const printWindow = window.open('', '_blank');

        if (!printWindow) {
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>QR kód</title>

                    <style>
                        body {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            margin: 0;
                        }

                        img {
                            width: 300px;
                            height: 300px;
                        }

                        @media print {
                            body {
                                min-height: auto;
                            }
                        }
                    </style>
                </head>

                <body>
                    <img src="${qrCode.value}" alt="QR kód">
                </body>
            </html>
        `);

        printWindow.document.close();

        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };
    };

    onMounted(() => {
        subscription = failuresUiVue
            .reportableAssetsRepository
            .live()
            .subscribe({
                next: data => {
                    reportableAssets.value = data;
                }
            });
    });

    onUnmounted(() => {
        subscription?.unsubscribe();
    });
</script>

<template>
    <div class="border-b border-gray-200 px-5 py-4">
        <div class="flex items-center justify-between gap-4">
            <div>
                <h2 class="text-lg font-semibold text-gray-900">
                    Reportable Assets
                </h2>

                <p class="mt-1 text-sm text-gray-500">
                    {{ filteredReportableAssets.length }} z {{ reportableAssets.length }} záznamov
                </p>
            </div>

            <input
                v-model="search"
                type="search"
                placeholder="Hľadať vozidlo..."
                class="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
        </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div class="border-b border-gray-200 px-5 py-4">
            <h2 class="text-lg font-semibold text-gray-900">
                Reportable Assets
            </h2>

            <p class="mt-1 text-sm text-gray-500">
                {{ reportableAssets.length }} záznamov
            </p>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                        <th class="px-5 py-3 font-semibold">
                            Kód
                        </th>

                        <th class="px-5 py-3 font-semibold">
                            Model
                        </th>

                        <th class="px-5 py-3 text-right font-semibold">
                            Akcia
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-100">
                    <tr
                        v-for="reportableAsset in filteredReportableAssets"
                        :key="reportableAsset.id"
                        class="transition hover:bg-gray-50"
                    >
                        <td class="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                            {{ reportableAsset.code }}
                        </td>

                        <td class="px-5 py-4 text-gray-600">
                            {{ reportableAsset.model?.name ?? '—' }}
                        </td>

                        <td class="px-5 py-4 text-right">
                            <button
                                type="button"
                                class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                @click="showQrCode(reportableAsset)"
                            >
                                QR kód
                            </button>
                        </td>
                    </tr>

                    <tr v-if="reportableAssets.length === 0">
                        <td
                            colspan="3"
                            class="px-5 py-8 text-center text-sm text-gray-500"
                        >
                            Žiadne záznamy.
                        </td>
                    </tr>

                    <tr v-else-if="filteredReportableAssets.length === 0">
                        <td
                            colspan="3"
                            class="px-5 py-8 text-center text-sm text-gray-500"
                        >
                            Žiadne vozidlo nezodpovedá vyhľadávaniu.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div
        v-if="isQrModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="closeQrModal"
    >
        <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div class="mb-4 flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                        QR kód
                    </h2>

                    <p
                        v-if="selectedReportable"
                        class="mt-1 text-sm text-gray-500"
                    >
                        {{ selectedReportable.code }}
                    </p>
                </div>

                <button
                    type="button"
                    class="text-gray-400 hover:text-gray-600"
                    @click="closeQrModal"
                >
                    ✕
                </button>
            </div>

            <img
                v-if="qrCode"
                :src="qrCode"
                alt="QR kód"
                class="mx-auto"
            >

            <div class="mt-6 flex justify-center gap-3">
                <button
                    type="button"
                    class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    @click="downloadQrCode"
                >
                    Uložiť obrázok
                </button>

                <button
                    type="button"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    @click="printQrCode"
                >
                    Tlačiť
                </button>
            </div>
        </div>
    </div>
</template>