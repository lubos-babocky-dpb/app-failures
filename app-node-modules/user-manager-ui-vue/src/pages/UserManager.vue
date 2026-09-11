<script setup>
    import { DataTable, Modal } from '@dpb/app-base-vue';
    import { ref } from 'vue';
    import { userRepository } from '../repositories/user-repository';

    defineOptions({
        router: {
            pageName: 'UserManager',
            requiredAnyPermission: ['page-access.user-manager']
        },
    });

    const edit = (row) => console.log('Edit: ', row);
    const remove = (row) => console.log('Remove: ', row);

    const columns = [
        {
            label: 'Meno',
            field: 'name',
            action: row => {
                console.log('User clicked:', row);
            },
        },

        {
            label: 'e-Mail',
            field: 'email',
        },

        {
            label: 'PID',
            field: 'personal_id',
        },
    
        {
            label: 'Admin',
            content: row => row.email === 'admin@dpb.sk' ? 'Y' : 'N'
        },

        {
            label: 'Akcie',
            content: [
                {type: 'button', label: 'Upraviť', action: row => edit(row)},
                {type: 'button', label: 'Zmazať', action: row => remove(row)},
            ],
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