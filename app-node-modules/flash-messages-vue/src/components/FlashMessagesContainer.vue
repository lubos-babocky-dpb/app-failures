<script setup>
    import { ref, computed, onMounted, onUnmounted } from 'vue';
    import { flashMessageRepository } from '../repositories/flash-message-repository.js';

    const container = ref(null);
    const isOpen = ref(false);
    const unreadMessages = ref([]);

    let subscription;
    let initialized = false;
    let previousMessageUuids = new Set();

    onMounted(() => {
        subscription = flashMessageRepository
            .liveUnread()
            .subscribe(messages => {
                const currentMessageUuids = new Set(
                    messages.map(message => message.uuid)
                );

                if (initialized) {
                    const newMessageArrived = messages.some(
                        message => !previousMessageUuids.has(message.uuid)
                    );

                    if (newMessageArrived) {
                        isOpen.value = true;
                    }
                }

                unreadMessages.value = messages;
                previousMessageUuids = currentMessageUuids;
                initialized = true;
            });

        document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
        subscription?.unsubscribe();
        document.removeEventListener('click', handleClickOutside);
    });

    const unreadCount = computed(() => unreadMessages.value.length);

    const toggle = () => {
        isOpen.value = !isOpen.value;
    };

    const handleClickOutside = (event) => {
        if (!container.value?.contains(event.target)) {
            isOpen.value = false;
        }
    };

    const markAsRead = async (message) => {
        await flashMessageRepository.markAsRead(message.uuid);
    };

    const markAllAsRead = async () => {
        await flashMessageRepository.markAllAsRead();
    };
</script>

<template>
    <div
        ref="container"
        class="relative"
    >
        <button
            type="button"
            class="relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors hover:bg-white/10"
            @click="toggle"
        >
            <span class="text-xl">
                ✉
            </span>

            <span
                v-if="unreadCount"
                class="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-white text-[#e30613] text-xs font-bold border-2 border-[#e30613]"
            >
                {{ unreadCount }}
            </span>
        </button>

        <div
            v-if="isOpen"
            class="absolute right-0 top-full mt-3 w-96 bg-white text-slate-900 rounded-xl border border-slate-200 shadow-xl z-[100]"
        >
            <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <div class="font-bold">
                    Správy
                </div>

                <button
                    v-if="unreadMessages.length"
                    type="button"
                    title="Vymazať všetky správy"
                    class="text-slate-400 hover:text-red-600 transition-colors"
                    @click="markAllAsRead"
                >
                    🗑
                </button>
            </div>

            <div
                v-if="unreadMessages.length"
                class="max-h-96 overflow-y-auto"
            >
                <div
                    v-for="message in unreadMessages"
                    :key="message.uuid"
                    class="flex items-start gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0"
                >
                    <div class="flex-1 min-w-0">
                        <div class="font-semibold">
                            {{ message.title }}
                        </div>

                        <div class="mt-1 text-sm text-slate-600">
                            {{ message.body }}
                        </div>
                    </div>

                    <button
                        type="button"
                        title="Označiť ako prečítané"
                        class="shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
                        @click="markAsRead(message)"
                    >
                        👁
                    </button>
                </div>
            </div>

            <div
                v-else
                class="px-4 py-8 text-center text-sm text-slate-400"
            >
                Žiadne nové správy.
            </div>
        </div>
    </div>
</template>