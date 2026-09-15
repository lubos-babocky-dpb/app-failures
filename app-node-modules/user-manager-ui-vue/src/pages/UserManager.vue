<script setup>
    import { Button, DataTable, Modal } from '@dpb/app-base-vue';
    import { ref } from 'vue';
    import { userRepository } from '../repositories/user-repository';
    import UserForm from '../components/forms/UserForm.vue';

    defineOptions({
        router: {
            pageName: 'UserManager',
            requiredAnyPermission: ['page-access.user-manager']
        },
    });

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
                {type: 'button', label: 'Upraviť', action: row => openEditUserModal(row) },
                {type: 'button', label: 'Zmazať', action: (row) => userRepository.delete(row.uuid) },
            ],
        },
    ];

    const detailModal = ref(null);
    const createUserModal = ref(null);
    const editUserModal = ref(null);
    const selectedUser = ref(null);

    const openCreateUserModal = () => {
        createUserModal.value.open();
    }

    const openEditUserModal = (user) => {
        selectedUser.value = user;
        editUserModal.value.open();
    }

    function openUserDetailModal(row) {
        detailModal.value.open();
    }

</script>

<template>
    <div>
        User management
        <Button
            :variant="'primary'"
            @click="openCreateUserModal"
        >
            Pridať užívateľa
        </Button>
    </div>
    <div>
        <DataTable
            :query="userRepository.live()"
            :columns="columns"
            @row-click="openUserDetailModal"
        />
    </div>
    <Modal
        ref="detailModal"
        title="User"
    >
        <div v-if="selectedUser">
            {{ selectedUser.code }}
        </div>
    </Modal>
    <Modal
        ref="createUserModal"
        title="Pridať užívateľa"
    >
        <UserForm
            @submitted="() => createUserModal.close()"
        />
    </Modal>
    <Modal
        ref="editUserModal"
        title="Upraviť zamestnanca"
    >
        <UserForm :user="selectedUser" />
    </Modal>
</template>