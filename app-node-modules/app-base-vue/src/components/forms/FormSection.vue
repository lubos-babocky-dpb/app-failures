<script setup>
    defineEmits([
        'activate',
    ]);
</script>

<template>
    <div
        class="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 transition-colors flex flex-col min-h-35"
        @click="$emit('activate', $event)"
    >
        <slot />
    </div>
</template>