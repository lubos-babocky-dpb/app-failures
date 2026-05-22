import { db } from './db';
import { ref } from 'vue';

export const currentUser = ref({
    uuid: '',
    fullName: 'Načítavam...',
    personalNumber: null,
    department: { code: null, name: null }
});

/**
 * Resolves the immutable device UUID from storage or generates a brand new one.
 */
async function getOrCreateDeviceUuid() {
    let uuid = localStorage.getItem('dpb_user_uuid');
    
    // Fallback lookup into IndexedDB if localStorage was wiped
    if (!uuid) {
        const storedConfig = await db.app_config.get('user_uuid');
        if (storedConfig) {
            uuid = storedConfig.value;
            localStorage.setItem('dpb_user_uuid', uuid);
        }
    }

    // Generate a fresh UUID if absolutely no local records exist
    if (!uuid) {
        uuid = crypto.randomUUID();
        localStorage.setItem('dpb_user_uuid', uuid);
        await db.app_config.put({ key: 'user_uuid', value: uuid });
    }

    return uuid;
}

/**
 * Bootstraps the local user identity and synchronizes profile status with the Laravel backend.
 */
export async function initUserIdentity() {
    try {
        const uuid = await getOrCreateDeviceUuid();
        
        // Populate initial template state with the guaranteed UUID
        currentUser.value.uuid = uuid;

        // Load cached profile data from local DB first to support instant offline rendering
        const cachedProfile = await db.app_config.get('user_profile');
        if (cachedProfile) {
            currentUser.value = { ...currentUser.value, ...cachedProfile.value };
        }

        if (!navigator.onLine) return;

        // Perform server handshake to update profile attributes
        const response = await fetch('/api/v1/user/handshake', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ uuid })
        });

        if (response.ok) {
            const serverUser = await response.json();
            if (serverUser) {
                currentUser.value = serverUser;
                // Cache the server response profile into local storage
                await db.app_config.put({ key: 'user_profile', value: serverUser });
            }
        }
    } catch (error) {
        console.error('Identity handshake failed:', error);
    }
}