<script setup>
    import { DataTable, Modal } from '@dpb/app-base-vue';
    import { failuresUiVue } from '@dpb/failures-ui-vue';
    import { ref } from 'vue';
    import { userRepository } from '../repositories/user-repository';

    defineOptions({
        router: {
            pageName: 'UserManager',
            requiredAnyPermission: ['page-access.user-manager']
        },
    });

    const columns = [
        {
            field: 'code',
            label: 'Kód',
            action: row => {
                console.log('User clicked:', row);
            },
        },

        {
            field: 'model.name',
            label: 'Model',
        },

        {
            field: 'type.name',
            label: 'Typ',
        },

        {
            label: 'Upraviť',
            action: row => {
                console.log('Edit:', row);
            },
        },
    ];

    const modal = ref(null);
    const selectedUser = ref(null);

    function handleRowClick(row) {
        console.log('Clicked row:', row);
        selectedUser.value = row;
        modal.value.open();
    }

</script>

<template>
    <div>
        User management
    </div>
    <div>
        <DataTable
            :query="userRepository.live()"
            :columns="columns"
            @row-click="handleRowClick"
        />
    </div>
    <Modal
        ref="modal"
        title="Vozidlo"
    >
        <div v-if="selectedUser">
            {{ selectedUser.code }}
        </div>
    </Modal>
</template>