import axios from 'axios';

const endpoint = '/failures-api/v1/admin/failures';

export async function fetchCategories() {
    const { data } = await axios.get(`${endpoint}/categories`);

    return data.data;
}

export async function fetchFailureTypes() {
    const { data } = await axios.get(`${endpoint}/types`);

    return data.data;
}

export async function createCategory(name, parentUuid = null) {
    const { data } = await axios.post(`${endpoint}/categories`, {
        name,
        parent_uuid: parentUuid,
    });

    return data.data;
}

export async function deleteCategory(uuid) {
    await axios.delete(`${endpoint}/categories/${uuid}`);
}

export async function createFailureType(name, categoryUuid) {
    const { data } = await axios.post(`${endpoint}/types`, {
        name,
        category_uuid: categoryUuid,
    });

    return data.data;
}

export async function deleteFailureType(uuid) {
    await axios.delete(`${endpoint}/types/${uuid}`);
}