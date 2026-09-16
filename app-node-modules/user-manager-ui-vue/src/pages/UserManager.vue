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
        {label: 'Meno', field: 'name', action: row => { console.log('User clicked:', row); }},
        { label: 'e-Mail', field: 'email' },
        { label: 'PID', field: 'personalId' },
        { label: 'Admin', content: row => row.email === 'admin@dpb.sk' ? 'Y' : 'N' },
        {
            label: 'Akcie',
            content: [
                {type: 'button', label: 'Upraviť', action: row => openEditUserModal(row) },
                {type: 'button', label: 'Zmazať', action: (row) => userRepository.delete(row.uuid) },
            ],
        },
    ];

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

</script>

<template>
    <div class="flex items-center justify-between gap-4">
        <span>User management</span>
        <div>
            <Button class="px-5 py-0 mb-2" variant="primary" @click="openCreateUserModal">
                Pridať užívateľa
            </Button>
        </div>
    </div>
    <div>
        <DataTable
            :query="userRepository.live()"
            :columns="columns"
            @row-click="openEditUserModal"
        />
    </div>
    <Modal
        ref="createUserModal"
        title="Pridať užívateľa"
    >
        <UserForm @submitted="() => createUserModal.close()" />
    </Modal>
    <Modal
        ref="editUserModal"
        title="Upraviť zamestnanca"
    >
        <UserForm :user="selectedUser" @submitted="() => editUserModal.close()" />
    </Modal>
</template>