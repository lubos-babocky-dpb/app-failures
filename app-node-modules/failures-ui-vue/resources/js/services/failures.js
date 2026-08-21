import axios from 'axios';
import { Gatekeeper } from '@dpb/gatekeeper';

const endpoint = '/failures-api/v1/admin/failures';

function authHeaders() {
    return {
        Authorization: `Bearer ${Gatekeeper.token}`
    };
}

export async function fetchCategories() {
    const { data } = await axios.get(`${endpoint}/categories`, { headers: authHeaders() });

    return data.data;
}

export async function fetchFailureTypes() {
    const { data } = await axios.get(`${endpoint}/types`, { headers: authHeaders() });

    return data.data;
}

export async function createCategory(name, parentUuid = null) {
    const { data } = await axios.post(
        `${endpoint}/categories`,
        { name, parent_uuid: parentUuid },
        { headers: authHeaders() }
    );

    return data.data;
}

export async function deleteCategory(uuid) {
    await axios.delete(`${endpoint}/categories/${uuid}`, { headers: authHeaders() });
}

export async function createFailureType(name, categoryUuid) {
    const { data } = await axios.post(
        `${endpoint}/types`,
        {name, category_uuid: categoryUuid},
        { headers: authHeaders() }
    );

    return data.data;
}

export async function deleteFailureType(uuid) {
    await axios.delete(`${endpoint}/types/${uuid}`, { headers: authHeaders() });
}