<script setup>
    import LoginForm from '../components/forms/LoginForm.vue';
</script>

<template>
    <div class="flex min-h-full items-center justify-center">
        <div class="w-full max-w-xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-200 px-6 py-5">
                <h1 class="text-xl font-semibold">
                    Prihlásenie
                </h1>

                <p class="mt-1 text-sm text-slate-500">
                    Prihláste sa do administrácie systému.
                </p>
            </div>

            <LoginForm />
        </div>
    </div>
</template>