export function buildFailureTree(categories, failureTypes) {
    const categoryMap = new Map();

    for (const category of categories) {
        categoryMap.set(category.uuid, {
            ...category,
            type: 'category',
            children: [],
            failures: [],
        });
    }

    const roots = [];

    for (const category of categoryMap.values()) {
        if (category.parent_uuid) {
            const parent = categoryMap.get(category.parent_uuid);

            if (parent) {
                parent.children.push(category);
            }
        } else {
            roots.push(category);
        }
    }

    for (const failure of failureTypes) {
        const category = categoryMap.get(failure.category_uuid);

        if (category) {
            category.failures.push({
                ...failure,
                type: 'failure',
            });
        }
    }

    // Aliases expose the content of their original category.
    for (const category of categoryMap.values()) {
        if (!category.alias_of) {
            continue;
        }

        const original = categoryMap.get(category.alias_of);

        if (!original) {
            continue;
        }

        category.children = original.children;
        category.failures = original.failures;
    }

    return roots;
}