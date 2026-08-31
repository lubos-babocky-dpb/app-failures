<script setup>
    import { computed, onBeforeUnmount, watch, ref } from 'vue';

    let activeModalClose = null;

    const emit = defineEmits([
        'close',
    ]);

    const props = defineProps({
        title: {
            type: String,
            default: null,
        },

        size: {
            type: String,
            default: 'md',
            validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value),
        },

        closeOnOverlay: {
            type: Boolean,
            default: true,
        },

        closeOnEscape: {
            type: Boolean,
            default: true,
        },

        showCloseButton: {
            type: Boolean,
            default: true,
        },

        contentPadding: {
            type: String,
            default: 'normal',
            validator: (value) => ['none', 'normal'].includes(value),
        },
    });

    const isOpen = ref(false);

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    const contentPaddings = {
        none: '',
        normal: 'px-6 py-5',
    };

    const modalSize = computed(() => sizes[props.size]);

    const contentPaddingClass = computed(() => {
        return contentPaddings[props.contentPadding];
    });

    function open() {
        if (activeModalClose) {
            activeModalClose();
        }

        activeModalClose = close;
        isOpen.value = true;
    }

    function close() {
        if (!isOpen.value) {
            return;
        }

        isOpen.value = false;

        if (activeModalClose === close) {
            activeModalClose = null;
        }

        emit('close');
    }

    function handleEscape(event) {
        if (isOpen.value && props.closeOnEscape && event.key === 'Escape') {
            close();
        }
    }

    function handleOverlayClick() {
        if (props.closeOnOverlay) {
            close();
        }
    }

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
        if (activeModalClose === close) {
            activeModalClose = null;
        }

        document.removeEventListener('keydown', handleEscape);
        document.body.classList.remove('overflow-hidden');
    });

    defineExpose({
        open,
        close,
    });
</script>

<template>
    <slot name="trigger" :open="open" />

    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen"
                class="fixed inset-0 bg-red-900/60 backdrop-blur-sm z-500 transition-opacity duration-300"
                role="dialog"
                aria-modal="true"
                @click.self="handleOverlayClick"
            >
                <div class="flex min-h-full items-center justify-center p-4">
                    <div :class="['relative w-full rounded-lg bg-white shadow-xl', modalSize]">
                        <div
                            v-if="$slots.header || title"
                            class="flex items-center justify-between border-b px-6 py-4"
                        >
                            <slot name="header">
                                <h2 class="text-lg font-semibold">
                                    {{ title }}
                                </h2>
                            </slot>

                            <button
                                v-if="showCloseButton"
                                type="button"
                                class="ml-4 text-gray-400 hover:text-gray-600"
                                aria-label="Zavrieť"
                                @click="close"
                            >
                                &times;
                            </button>
                        </div>

                        <button
                            v-else-if="showCloseButton"
                            type="button"
                            class="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-black/50 text-xl text-white backdrop-blur-md hover:bg-black/70"
                            aria-label="Zavrieť"
                            @click="close"
                        >
                            &times;
                        </button>

                        <div :class="contentPaddingClass">
                            <slot />
                        </div>

                        <div
                            v-if="$slots.footer"
                            class="border-t px-6 py-4"
                        >
                            <slot name="footer" />
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>