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

// Kontrola a registrácia push tokenu hneď pri štarte aplikácie, bez čakania na klikanie
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(() => {
        if (typeof window.subscribeUserToPush === 'function') {
            // Spustí sa potichu na pozadí pri každom štarte/refreshi aplikácie
            window.subscribeUserToPush();
        }
    });
}

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
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        
        // Zistíme stav povolenia PREDTÝM, než požiadame o nové (aby sme vedeli, či máme dať neskôr alert)
        const existingPermission = Notification.permission;

        // Ak už používateľ v minulosti notifikácie natvrdo zamietol, neotravujeme ho
        if (existingPermission === 'denied') {
            return;
        }

        // Vyžiadanie/overenie povolenia
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
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
        const userUuid = localStorage.getItem('dpb_user_uuid'); 

        if (!userUuid) {
            console.error('Push odber zlyhal: UUID zariadenia nebolo nájdené v localStorage.');
            return;
        }

        // POST dopyt prebehne zakaždým, čím zabezpečíme, že tabuľka v DB bude VŽDY plná a zosynchronizovaná
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

        // OPRAVA: Alert vyskočí IBA vtedy, ak sa stav zmenil z 'default' (prvé povolenie) na 'granted'
        // Ak bol stav už predtým 'granted', kód zbehne úplne potichu na pozadí bez otravovania!
        if (existingPermission === 'default') {
            alert('Notifikácie boli úspešne aktivované!');
        }

    } catch (error) {
        console.error('Chyba pri registrácii push odberu:', error);
    }
};