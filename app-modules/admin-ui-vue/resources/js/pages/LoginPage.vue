<script setup>
    import LoginForm from '../components/forms/LoginForm.vue';
</script>

<template>
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-200">
            <h1 class="text-xl font-semibold">
                Prihlásenie
            </h1>

            <p class="mt-1 text-sm text-slate-500">
                Prihláste sa do administrácie systému.
            </p>
        </div>

        <LoginForm />
    </div>
</template>