<script setup>
  import { watch } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { locale } = useI18n();

  watch(locale, (newLocale) => {
    localStorage.setItem('dpb_locale', newLocale);
  });
</script>

<template>
  <select v-model="locale" class="bg-white/10 text-white p-1 rounded text-sm border-none font-bold outline-none mr-2">
    <option value="sk" class="text-slate-900">SK</option>
    <option value="en" class="text-slate-900">EN</option>
    <option value="ru" class="text-slate-900">RU</option>
  </select>
</template>