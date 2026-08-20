<script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { Gatekeeper, GatekeeperEvents, IdentityUpdatedEvent } from '@dpb/gatekeeper';
  import { syncStaticData, syncPendingFailures, syncFailureStatuses } from './sync';
  import LanguageMenu from './components/ui/LanguageMenu.vue';
  import NotificationContainer from './components/ui/NotificationContainer.vue';
  import SideNavigation from './components/ui/SideNavigation.vue';
  import Modal from './components/ui/Modal.vue';

  const personalAccessToken = ref(null);

  onMounted(async () => {
      try {
          personalAccessToken.value = Gatekeeper.token;
          Gatekeeper.addEventListener(IdentityUpdatedEvent.TYPE, (e) => { personalAccessToken.value = Gatekeeper.token; });
          await syncStaticData();
          await syncPendingFailures();
          await syncFailureStatuses();
      } catch (error) {
          console.warn('Inicializačná synchronizácia zlyhala (pravdepodobne offline režim):', error);
      }
  });

  const handleLogin = async () => {
    await Gatekeeper.loginWithCredentials(credentials.username, credentials.password);
  };
</script>

<style scoped>
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background: white;
    border: 1px solid #ccc;
  }
</style>

<template>
  <div class="h-dvh flex flex-col bg-slate-100 text-slate-900 antialiased font-[sans-serif]">
    <header class="bg-[#e30613] text-white shadow-lg sticky top-0 z-50">
        <div class="px-4 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-3">
                <img :src="'/icon-512.png'" alt="DPB" class="w-10 h-10 object-contain">
                <div class="leading-tight uppercase text-xs font-bold">
                    Dopravný podnik<br><span class="font-light text-white/90 uppercase">Bratislava</span>
                </div>
            </div>

            <div class="flex items-center space-x-2">
                <LanguageMenu></LanguageMenu>
                <NotificationContainer></NotificationContainer>
                <SideNavigation></SideNavigation>
            </div>
        </div>
    </header>

    <main class="flex-1 min-h-0 max-w-xl w-full mx-auto p-6 flex flex-col">
      <div class="flex-1 min-h-0">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>