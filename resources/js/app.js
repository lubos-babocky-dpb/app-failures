import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { i18n } from './i18n';
import { initUserIdentity } from './userAuth';
import { syncStaticData, syncPendingFailures } from './sync';

// Run initial synchronization routines on application bootstrap
initUserIdentity().then(() => {
    syncStaticData().then(() => {
        // Attempt to upload any cached reports once registries are verified
        syncPendingFailures();
    });
});

// Automaticky požiada o povolenie pri prvom kliknutí používateľa kamkoľvek na stránku
window.addEventListener('click', function onceClick() {
    if (typeof window.subscribeUserToPush === 'function') {
        window.subscribeUserToPush();
    }
    // Odstránime listener, aby to nevyskakovalo pri každom ďalšom kliknutí
    window.removeEventListener('click', onceClick);
}, { once: true });

// Register global network status listeners to auto-trigger syncing when connectivity resumes
window.addEventListener('online', () => {
    console.log('Network connectivity restored. Triggering upload sync...');
    syncPendingFailures();
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');

// =========================================================================
// PUSH NOTIFIKÁCIE PRE DPB DISPEČING
// =========================================================================

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

window.subscribeUserToPush = async function() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        alert('Tento prehliadač nepodporuje push notifikácie. Ak máte iPhone, musíte si aplikáciu najprv pridať na plochu cez Safari.');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            alert('Na prijímanie dôležitých správ z dispečingu musíte povoliť notifikácie.');
            return;
        }

        if (!window.config || !window.config.vapidPublicKey) {
            console.error('VAPID Public kľúč chýba vo window.config. Skontrolujte pwa.blade.php');
            return;
        }

        const publicKey = urlBase64ToUint8Array(window.config.vapidPublicKey);

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicKey
        });

        const subJson = subscription.toJSON();

        // Vytiahnutie správneho UUID zariadenia na základe kódu z userAuth.js
        const userUuid = localStorage.getItem('dpb_user_uuid'); 

        if (!userUuid) {
            console.error('Push odber zlyhal: UUID zariadenia nebolo nájdené v localStorage.');
            return;
        }

        // POUŽIJEME ČISTÝ NATÍVNY FETCH BEZ AXIOSU
        const response = await fetch('/api/push-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                endpoint: subJson.endpoint,
                keys: {
                    p256dh: subJson.keys.p256dh,
                    auth: subJson.keys.auth
                },
                user_uuid: userUuid
            })
        });

        if (!response.ok) {
            throw new Error('Server odpovedal chybovým statusom: ' + response.status);
        }

        alert('Notifikácie boli úspešne aktivované!');

    } catch (error) {
        console.error('Chyba pri registrácii push odberu:', error);
        alert('Nepodarilo sa aktivovať notifikácie. Skontrolujte pripojenie alebo SSL certifikát servera.');
    }
};