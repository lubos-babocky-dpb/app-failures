<script setup>
defineProps({
    node: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <li>
        <div class="flex items-center gap-2 py-1">
            <span class="font-medium">
                {{ node.name }}
            </span>

            <span
                v-if="node.alias_of"
                class="text-xs text-slate-400"
            >
                alias
            </span>
        </div>

        <ul
            v-if="node.children.length || node.failures.length"
            class="ml-5 border-l border-slate-200 pl-4"
        >
            <FailureTreeNode
                v-for="child in node.children"
                :key="child.uuid"
                :node="child"
            />

            <li
                v-for="failure in node.failures"
                :key="failure.uuid"
                class="py-1 text-sm text-slate-600"
            >
                {{ failure.name }}
            </li>
        </ul>
    </li>
</template>