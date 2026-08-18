<script setup>
    import { computed, ref } from 'vue';

    import { createCategory, createFailureType, deleteCategory, deleteFailureType } from '../services/failures.js';

    import Modal from './Modal.vue';

    const creating = ref(false);
    const creatingFailureType = ref(false);
    const deleting = ref(false);

    const newCategoryName = ref('');
    const newFailureTypeName = ref('');

    const createCategoryColumn = ref(null);

    const createCategoryModal = ref(null);
    const createFailureTypeModal = ref(null);

    const props = defineProps({
        tree: {
            type: Array,
            required: true,
        },
    });

    const emit = defineEmits([
        'category-created',
        'category-deleted',
        'failure-created',
        'failure-deleted'
    ]);

    const path = ref([]);

    const columns = computed(() => {
        const result = [];
        let items = props.tree;

        result.push(items);

        for (const node of path.value) {
            items = [
                ...(node.children ?? []),
                ...(node.failures ?? []),
            ];

            result.push(items);
        }

        return result.slice(0, 3);
    });

    function select(node, columnIndex) {
        path.value = path.value.slice(0, columnIndex);

        if (node.type === 'category') {
            path.value.push(node);
        }
    }

    function openCreateCategory(columnIndex) {
        createCategoryColumn.value = columnIndex;
        newCategoryName.value = '';

        createCategoryModal.value.open();
    }

    function closeCreateCategory() {
        createCategoryModal.value.close();

        createCategoryColumn.value = null;
        newCategoryName.value = '';
    }

    async function submitCreateCategory() {
        const name = newCategoryName.value.trim();

        if (!name) {
            return;
        }

        creating.value = true;

        try {
            const parent = path.value[createCategoryColumn.value - 1] ?? null;

            const category = await createCategory(
                name,
                parent?.uuid ?? null,
            );

            emit('category-created', category);

            closeCreateCategory();
        } finally {
            creating.value = false;
        }
    }

    function openCreateFailureType() {
        newFailureTypeName.value = '';

        createFailureTypeModal.value.open();
    }

    function closeCreateFailureType() {
        createFailureTypeModal.value.close();

        newFailureTypeName.value = '';
    }

    async function submitCreateFailureType() {
        const name = newFailureTypeName.value.trim();

        if (!name) {
            return;
        }

        const category = path.value.at(-1);

        if (!category) {
            return;
        }

        creatingFailureType.value = true;

        try {
            const failure = await createFailureType(
                name,
                category.uuid,
            );

            emit('failure-created', failure);

            closeCreateFailureType();
        } finally {
            creatingFailureType.value = false;
        }
    }

    async function removeCategory(category) {
        if (!confirm(`Naozaj chcete zmazať kategóriu „${category.name}“?`)) {
            return;
        }

        deleting.value = true;

        try {
            await deleteCategory(category.uuid);

            emit('category-deleted', category.uuid);
        } finally {
            deleting.value = false;
        }
    }

    async function removeFailureType(failure) {
        if (!confirm(`Naozaj chcete zmazať poruchu „${failure.name}“?`)) {
            return;
        }

        deleting.value = true;

        try {
            await deleteFailureType(failure.uuid);

            emit('failure-deleted', failure.uuid);
        } finally {
            deleting.value = false;
        }
    }
</script>

<template>
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 class="text-lg font-semibold text-slate-900">
                Poruchy
            </h2>
        </div>

        <div class="grid min-h-125 grid-cols-3 bg-slate-50/50">
            <div
                v-for="columnIndex in 3"
                :key="columnIndex"
                class="min-w-0 border-r border-slate-200 p-3 last:border-r-0"
            >
                <template v-if="columns[columnIndex - 1]">
                    <div
                        v-for="item in columns[columnIndex - 1]"
                        :key="item.uuid"
                        class="group mb-2 flex items-center gap-1"
                    >
                        <button
                            type="button"
                            class="flex min-w-0 flex-1 items-center justify-between gap-3
                                rounded-lg border px-4 py-3 text-left text-sm
                                transition focus:outline-none focus:ring-2 focus:ring-slate-300"
                            :class="
                                item.type === 'failure'
                                    ? 'border-blue-200 bg-blue-50 text-blue-900 hover:border-blue-300 hover:bg-blue-100'
                                    : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                            "
                            @click="select(item, columnIndex - 1)"
                        >
                            <span class="min-w-0 truncate font-medium">
                                {{ item.name }}
                            </span>

                            <span
                                v-if="item.type === 'category'"
                                class="ml-3 shrink-0 text-lg leading-none text-slate-400
                                    transition group-hover:translate-x-0.5 group-hover:text-slate-600"
                            >
                                ›
                            </span>
                        </button>

                        <button
                            type="button"
                            :title="item.type === 'category' ? 'Zmazať kategóriu' : 'Zmazať poruchu'"
                            class="shrink-0 rounded-lg p-2 text-slate-400
                                transition hover:bg-red-50 hover:text-red-600
                                disabled:cursor-not-allowed disabled:opacity-50"
                            :disabled="deleting"
                            @click.stop="item.type === 'category' ? removeCategory(item) : removeFailureType(item)"
                        >
                            ×
                        </button>
                    </div>

                    <button
                        type="button"
                        class="mt-1 flex w-full items-center justify-center rounded-lg
                            border border-dashed border-slate-300 px-4 py-2.5
                            text-sm font-medium text-slate-500
                            transition hover:border-slate-400 hover:bg-white hover:text-slate-700"
                        @click="
                            columnIndex === 3
                                ? openCreateFailureType()
                                : openCreateCategory(columnIndex - 1)
                        "
                    >
                        + Pridať
                    </button>
                </template>
            </div>
        </div>
    </div>

    <Modal
        ref="createCategoryModal"
        title="Nová kategória"
        size="sm"
    >
        <form @submit.prevent="submitCreateCategory">
            <label class="block">
                <span class="text-sm font-medium text-slate-700">
                    Názov kategórie
                </span>

                <input
                    v-model="newCategoryName"
                    type="text"
                    autofocus
                    placeholder="Názov kategórie"
                    class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2
                        outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
            </label>

            <div class="mt-5 flex justify-end gap-2">
                <button
                    type="button"
                    class="rounded-lg border border-slate-300 px-4 py-2 text-sm
                        hover:bg-slate-50"
                    :disabled="creating"
                    @click="closeCreateCategory"
                >
                    Zrušiť
                </button>

                <button
                    type="submit"
                    class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white
                        hover:bg-slate-800 disabled:opacity-50"
                    :disabled="creating || !newCategoryName.trim()"
                >
                    {{ creating ? 'Ukladám...' : 'Vytvoriť' }}
                </button>
            </div>
        </form>
    </Modal>

    <Modal
        ref="createFailureTypeModal"
        title="Nová porucha"
        size="sm"
    >
        <form @submit.prevent="submitCreateFailureType">
            <label class="block">
                <span class="text-sm font-medium text-slate-700">
                    Názov poruchy
                </span>

                <input
                    v-model="newFailureTypeName"
                    type="text"
                    autofocus
                    placeholder="Názov poruchy"
                    class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2
                        outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
            </label>

            <div class="mt-5 flex justify-end gap-2">
                <button
                    type="button"
                    class="rounded-lg border border-slate-300 px-4 py-2 text-sm
                        hover:bg-slate-50"
                    :disabled="creatingFailureType"
                    @click="closeCreateFailureType"
                >
                    Zrušiť
                </button>

                <button
                    type="submit"
                    class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white
                        hover:bg-slate-800 disabled:opacity-50"
                    :disabled="creatingFailureType || !newFailureTypeName.trim()"
                >
                    {{ creatingFailureType ? 'Ukladám...' : 'Vytvoriť' }}
                </button>
            </div>
        </form>
    </Modal>
</template>