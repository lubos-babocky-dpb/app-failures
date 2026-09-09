<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
    query: {
        type: Object,
        required: true,
    },

    columns: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits([
    'row-click',
]);

const rows = ref([]);

function getValue(object, path) {
    return path
        .split('.')
        .reduce(
            (value, key) => value?.[key],
            object
        );
}

function handleRowClick(row, event) {
    if (event.target.closest('button, a')) {
        return;
    }

    emit('row-click', row);
}

function handleAction(action, row, event) {
    event.stopPropagation();

    action(row);
}

let subscription;

onMounted(() => {
    subscription = props.query.subscribe({
        next: value => {
            console.log(value);
            rows.value = value;
        },
        error: error => {
            console.error(error);
        },
    });
});

onUnmounted(() => {
    subscription?.unsubscribe();
});
</script>

<template>
    <div class="data-table-wrapper">
        <table class="data-table">
            <thead>
                <tr>
                    <th
                        v-for="column in columns"
                        :key="column.field ?? column.label"
                    >
                        {{ column.label }}
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="row in rows"
                    :key="row.id"
                    class="data-table-row"
                    @click="handleRowClick(row, $event)"
                >
                    <td
                        v-for="column in columns"
                        :key="column.field ?? column.label"
                        :class="{
                            'data-table-cell-action': column.action,
                        }"
                        @click="column.action && handleAction(column.action, row, $event)"
                    >
                        <button
                            v-if="column.action && column.field"
                            type="button"
                            class="data-table-action"
                        >
                            {{ getValue(row, column.field) }}
                        </button>

                        <button
                            v-else-if="column.action"
                            type="button"
                            class="data-table-action"
                        >
                            {{ column.label }}
                        </button>

                        <template v-else>
                            {{ getValue(row, column.field) }}
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.data-table-wrapper {
    width: 100%;
    overflow-x: auto;
    background: #ffffff;
    border: 1px solid #dbe4ee;
    border-radius: 16px;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    color: #0f172a;
    font-size: 14px;
}

.data-table thead {
    background: #ffffff;
}

.data-table th {
    padding: 14px 18px;
    border-bottom: 1px solid #dbe4ee;
    color: #7b91ad;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-align: left;
    text-transform: uppercase;
    white-space: nowrap;
}

.data-table td {
    padding: 15px 18px;
    border-bottom: 1px solid #edf1f5;
    color: #17233a;
    vertical-align: middle;
}

.data-table-row {
    transition: background-color 0.15s ease;
    cursor: pointer;
}

.data-table-row:hover {
    background-color: #f7f9fc;
}

.data-table-row:last-child td {
    border-bottom: none;
}

.data-table-cell-action {
    padding: 0;
}

.data-table-action {
    display: block;
    width: 100%;
    padding: 15px 18px;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.data-table-action:hover {
    color: #2563eb;
}
</style>