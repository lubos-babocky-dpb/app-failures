<script setup>
    const props = defineProps({
        variant: {
            type: String,
            default: 'primary',
            validator: (value) => ['primary', 'secondary'].includes(value),
        },
        type: {
            type: String,
            default: 'button',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    });

    const emit = defineEmits(['click',]);

    const variants = {
        primary: [
            'bg-[#e30613]',
            'text-white',
            'border',
            'border-slate-300',
            'active:bg-[#c40510]',
        ],
        secondary: [
            'bg-slate-100',
            'text-slate-500',
            'border',
            'border-slate-200',
            'active:bg-slate-200',
        ],
    };
    const handleClick = (event) => {
        emit('click', event);
    };
</script>

<template>
    <button
        :type="type"
        :disabled="disabled"
        :class="[
            variants[variant],
            {
                'cursor-not-allowed opacity-50': disabled,
            },
        ]"
        class="w-full text-center text-lg font-black uppercase tracking-wide py-4 rounded-2xl transition-colors shadow-sm"
        @click="handleClick"
    >
        <slot />
    </button>
</template>