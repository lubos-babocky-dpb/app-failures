<script setup>
import { Gatekeeper } from '@dpb/gatekeeper';
import { PageRouter } from '@dpb/page-router-vue';
import { ref } from 'vue';
import DashboardPage from '../../pages/DashboardPage.vue';


const personalId = ref('');
const password = ref('');

const loading = ref(false);
const error = ref('');

async function submit() {
    error.value = '';
    loading.value = true;

    try {
        await Gatekeeper.loginWithCredentials(
            String(personalId.value),
            String(password.value)
        );

        if(!Gatekeeper.hasAdminPrivileges) {
            error.value = 'Nemáte oprávnenie na tieto stránky';
            return;
        }

        await PageRouter.redirect(DashboardPage);

    } catch (exception) {
        console.error(exception);
        error.value = 'Nesprávne prihlasovacie údaje.';
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <form
        class="space-y-5 p-6"
        @submit.prevent="submit"
    >
        <div>
            <label
                for="personal-id"
                class="mb-1.5 block text-sm font-medium text-slate-700"
            >
                Prihlasovacie meno
            </label>

            <input
                id="personal-id"
                v-model="personalId"
                type="text"
                name="personal_id"
                autocomplete="username"
                class="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm
                       outline-none transition
                       focus:border-[#e30613] focus:ring-2 focus:ring-[#e30613]/20"
            >
        </div>

        <div>
            <label
                for="password"
                class="mb-1.5 block text-sm font-medium text-slate-700"
            >
                Heslo
            </label>

            <input
                id="password"
                v-model="password"
                type="password"
                name="password"
                autocomplete="current-password"
                class="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm
                       outline-none transition
                       focus:border-[#e30613] focus:ring-2 focus:ring-[#e30613]/20"
            >
        </div>

        <p
            v-if="error"
            class="text-sm text-red-600"
        >
            {{ error }}
        </p>

        <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-md bg-[#e30613] px-4 py-2.5 text-sm font-semibold text-white
                   shadow-sm transition
                   hover:bg-[#c80510]
                   focus:outline-none focus:ring-2 focus:ring-[#e30613]/40
                   focus:ring-offset-2
                   active:bg-[#b6040e]
                   disabled:cursor-not-allowed
                   disabled:opacity-60"
        >
            {{ loading ? 'Prihlasujem...' : 'Prihlásiť sa' }}
        </button>
    </form>
</template>