import axios from 'axios';
import { ref } from 'vue';

import User from '../models/user.js';
import database from './database.js';

const user = ref(null);
let token = null;
let initialized = false;

export async function login(personalId, password) {
    const { data } = await axios.post('/api/admin/login', {
        personal_id: personalId,
        password,
    });

    token = data.token;

    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    await database.auth.put({
        id: 'current',
        token,
    });

    await fetchUser();

    return user.value;
}

export async function fetchUser() {
    const { data } = await axios.get('/api/admin/me');

    user.value = new User({
        ...data.user,
        roles: data.roles,
    });

    await database.auth.put({
        id: 'current',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            personal_id: user.personalId,
            roles: user.roles,
        },
    });

    return user.value;
}

export async function initialize() {
    if (initialized) {
        return user.value;
    }

    initialized = true;

    const authentication = await database.auth.get('current');

    if (!authentication?.token) {
        return null;
    }

    token = authentication.token;

    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    try {
        return await fetchUser();
    } catch (exception) {
        if (exception.response?.status === 401) {
            await clearAuthentication();
        }

        throw exception;
    }
}

export async function logout() {
    try {
        await axios.post('/api/admin/logout');
    } finally {
        await clearAuthentication();
    }
}

export function getUser() {
    return user.value;
}

export function isAuthenticated() {
    return user.value !== null;
}

async function clearAuthentication() {
    user.value = null;
    token = null;

    delete axios.defaults.headers.common.Authorization;

    await database.auth.delete('current');
}