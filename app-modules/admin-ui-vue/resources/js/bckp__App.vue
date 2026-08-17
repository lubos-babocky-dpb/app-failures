<script setup>
import { ref } from 'vue';
import { login, fetchUser } from './services/auth.js';

const personalId = ref('');
const password = ref('');

const loading = ref(false);
const error = ref('');

async function submit() {
    error.value = '';
    loading.value = true;

    try {
        await login(
            personalId.value,
            password.value
        );

        const user = await fetchUser();

        console.log('Authenticated user:', user);
    } catch (exception) {
        console.error(exception);

        error.value = 'Nesprávne prihlasovacie údaje.';
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="min-h-screen bg-slate-100 text-slate-900 antialiased font-[sans-serif]">
        <header class="bg-[#e30613] text-white shadow-lg sticky top-0 z-50">
            <div class="px-4 py-4 flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <img
                        :src="'/icon-512.png'"
                        alt="DPB"
                        class="w-10 h-10 object-contain"
                    >

                    <div class="leading-tight uppercase text-xs font-bold">
                        Dopravný podnik<br>
                        <span class="font-light text-white/90">
                            Bratislava
                        </span>
                    </div>
                </div>
            </div>
        </header>

        <main class="max-w-xl mx-auto p-6">
            <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div class="px-6 py-5 border-b border-slate-200">
                    <h1 class="text-xl font-semibold">
                        Prihlásenie
                    </h1>

                    <p class="mt-1 text-sm text-slate-500">
                        Prihláste sa do administrácie systému.
                    </p>
                </div>

                <form
                    class="p-6 space-y-5"
                    @submit.prevent="submit"
                >
                    <div>
                        <label
                            for="login"
                            class="block text-sm font-medium text-slate-700 mb-1.5"
                        >
                            Prihlasovacie meno
                        </label>

                        <input
                            v-model="personalId"
                            id="login"
                            type="text"
                            name="login"
                            autocomplete="username"
                            class="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm
                                   outline-none transition
                                   focus:border-[#e30613] focus:ring-2 focus:ring-[#e30613]/20"
                        >
                    </div>

                    <div>
                        <label
                            for="password"
                            class="block text-sm font-medium text-slate-700 mb-1.5"
                        >
                            Heslo
                        </label>

                        <input
                            v-model="password"
                            id="password"
                            type="password"
                            name="password"
                            autocomplete="current-password"
                            class="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm
                                   outline-none transition
                                   focus:border-[#e30613] focus:ring-2 focus:ring-[#e30613]/20"
                        >
                    </div>

                    <button
                        type="submit"
                        :disabled="loading"
                        class="w-full rounded-md bg-[#e30613] px-4 py-2.5 text-sm font-semibold text-white
                               shadow-sm transition
                               hover:bg-[#c80510]
                               focus:outline-none focus:ring-2 focus:ring-[#e30613]/40 focus:ring-offset-2
                               active:bg-[#b6040e]"
                    >
                        {{ loading ? 'Prihlasujem...' : 'Prihlásiť sa' }}
                    </button>
                </form>
                <p
                    v-if="error"
                    class="mt-4 text-sm text-red-600"
                >
                    {{ error }}
                </p>
            </div>
        </main>
    </div>
</template>