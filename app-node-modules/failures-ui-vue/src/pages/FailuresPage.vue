<script setup>
    import { onMounted, ref } from 'vue';
    import { failuresUiVue } from '../index';
    import FailureBrowser from '../components/FailureBrowser.vue';
    import { fetchCategories, fetchFailureTypes } from '../services/failures.js';
    import { buildFailureTree } from '../utils/build-failure-free.js';

    defineOptions({
        router: {
            pageName: 'FailuresPage',
            requiredAnyPermission: ['page-access.failures']
        },
    });

    const tree = ref([]);
    const loading = ref(true);
    const error = ref('');

    async function loadFailures() {
        try {
            const [categories, failureTypes] = await Promise.all([
                failuresUiVue.failureCategoriesRepository.all(),
                failuresUiVue.failureTypesRepository.all(),
            ]);

            tree.value = buildFailureTree(
                categories,
                failureTypes,
            );
        } catch (exception) {
            console.error(exception);

            error.value = 'Nepodarilo sa načítať poruchy.';
        } finally {
            loading.value = false;
        }
    }

    function handleCategoryCreated(category) {
        const node = {
            ...category,
            type: 'category',
            children: [],
            failures: [],
        };

        if (!category.parent_uuid) {
            tree.value.push(node);

            return;
        }

        const parent = findCategory(tree.value, category.parent_uuid);

        if (parent) {
            parent.children.push(node);
        }
    }

    function findCategory(categories, uuid) {
        for (const category of categories) {
            if (category.uuid === uuid) {
                return category;
            }

            const found = findCategory(
                category.children ?? [],
                uuid,
            );

            if (found) {
                return found;
            }
        }

        return null;
    }

    function removeCategoryFromTree(categories, uuid) {
        const index = categories.findIndex(
            category => category.uuid === uuid,
        );

        if (index !== -1) {
            categories.splice(index, 1);

            return true;
        }

        for (const category of categories) {
            if (removeCategoryFromTree(category.children ?? [], uuid)) {
                return true;
            }
        }

        return false;
    }

    function handleFailureCreated(failure) {
        const category = findCategory(
            tree.value,
            failure.category_uuid,
        );

        if (!category) {
            return;
        }

        category.failures.push({
            ...failure,
            type: 'failure',
        });
    }

    function handleCategoryDeleted(uuid) {
        removeCategoryFromTree(tree.value, uuid);
    }

    function handleFailureDeleted(uuid) {
        for (const category of tree.value) {
            if (removeFailureFromCategory(category, uuid)) {
                return;
            }
        }
    }

    function removeFailureFromCategory(category, uuid) {
        const index = (category.failures ?? []).findIndex(
            failure => failure.uuid === uuid,
        );

        if (index !== -1) {
            category.failures.splice(index, 1);

            return true;
        }

        for (const child of category.children ?? []) {
            if (removeFailureFromCategory(child, uuid)) {
                return true;
            }
        }

        return false;
    }

    onMounted(loadFailures);
</script>

<template>
    <div class="mx-auto max-w-7xl p-6">
        <div
            v-if="loading"
            class="text-slate-500"
        >
            Načítavam...
        </div>

        <div
            v-else-if="error"
            class="text-red-600"
        >
            {{ error }}
        </div>

        <FailureBrowser
            v-else
            :tree="tree"
            @category-created="handleCategoryCreated"
            @category-deleted="handleCategoryDeleted"
            @failure-created="handleFailureCreated"
            @failure-deleted="handleFailureDeleted"
        />
    </div>
</template>