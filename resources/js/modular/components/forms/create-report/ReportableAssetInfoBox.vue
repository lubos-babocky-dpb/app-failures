<script setup>
    const failureReport = defineModel();
</script>

<template>
    <div
        class="flex flex-col justify-center"
    >
        <div class="flex justify-between items-baseline w-full">
            <div class="text-5xl font-black text-slate-900 leading-none tracking-tight">
                {{ failureReport.reportableAsset?.code ?? '' }}
            </div>

            <div class="text-xl font-black text-slate-500 uppercase leading-none text-right pl-2">
                {{ failureReport.reportableAsset?.type?.name ?? '' }}
            </div>
        </div>

        <div class="text-lg font-bold text-slate-400 uppercase tracking-wide mt-2">
            {{ failureReport.reportableAsset?.model?.name ?? '' }}
        </div>
    </div>
</template>