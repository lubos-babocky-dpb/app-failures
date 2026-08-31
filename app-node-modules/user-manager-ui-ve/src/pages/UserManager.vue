<script setup>
    import { UserManagerApiService } from '../api/UserManagerApiService';
    import { Gatekeeper } from '@dpb/gatekeeper';

    const userManagerApiService = new UserManagerApiService({
        baseUrl: 'http://localhost/',
        bearerToken: Gatekeeper.token
    });

</script>

<template>
    User management
</template>