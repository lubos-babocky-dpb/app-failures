<script setup>
    defineOptions({
        router: {
            pageName: 'Restricted',
            guard: {
                requiredAnyPermission: ['failures.view']
            }
        }
    });
</script>

<template>
    You shouldn't be here!
</template>