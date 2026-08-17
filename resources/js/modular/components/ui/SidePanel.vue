<script setup>
import { ref, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
    side: {
        type: String,
        default: 'right',
        validator: (value) => ['left', 'right'].includes(value),
    },

    width: {
        type: String,
        default: 'w-80',
    },

    closeOnOverlay: {
        type: Boolean,
        default: true,
    },

    closeOnEscape: {
        type: Boolean,
        default: true,
    },
});

const isOpen = ref(false);

const open = () => {
    isOpen.value = true;
};

const close = () => {
    isOpen.value = false;
};

const handleEscape = (event) => {
    if (
        isOpen.value &&
        props.closeOnEscape &&
        event.key === 'Escape'
    ) {
        close();
    }
};

const handleOverlayClick = () => {
    if (props.closeOnOverlay) {
        close();
    }
};

watch(isOpen, (open) => {
    if (open) {
        document.addEventListener('keydown', handleEscape);
        document.body.classList.add('overflow-hidden');
    } else {
        document.removeEventListener('keydown', handleEscape);
        document.body.classList.remove('overflow-hidden');
    }
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleEscape);
    document.body.classList.remove('overflow-hidden');
});
</script>

<template>
    <!-- Trigger zostáva na pôvodnom mieste -->
    <slot
        name="trigger"
        :open="open"
    />

    <Teleport to="body">
        <!-- Overlay -->
        <Transition
            enter-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-300"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen"
                class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-60"
                @click="handleOverlayClick"
            />
        </Transition>

        <!-- Side panel -->
        <Transition
            enter-active-class="transform transition-transform duration-300 ease-in-out"
            :enter-from-class="
                side === 'right'
                    ? 'translate-x-full'
                    : '-translate-x-full'
            "
            enter-to-class="translate-x-0"
            leave-active-class="transform transition-transform duration-300 ease-in-out"
            leave-from-class="translate-x-0"
            :leave-to-class="
                side === 'right'
                    ? 'translate-x-full'
                    : '-translate-x-full'
            "
        >
            <aside
                v-if="isOpen"
                :class="[
                    'fixed top-0 h-full bg-white z-70 shadow-2xl flex flex-col',
                    width,
                    side === 'right'
                        ? 'right-0'
                        : 'left-0',
                ]"
            >
                <slot :close="close" />
            </aside>
        </Transition>
    </Teleport>
</template>