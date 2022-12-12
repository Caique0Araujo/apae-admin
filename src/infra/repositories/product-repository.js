import { API_URL } from '../../settings.js';

export async function createProduct(formData, token) {
    const response = await fetch(`${API_URL}/products/create`, {
        body: formData,
        method: 'POST',
        headers: {
            'authorization': `BEARER ${token}`
        },
    });

    if (response.status === 401) {
        const error = { status: 401 };
        throw error;
    } else if (response.status === 201) {
        return;
    }

    const json = await response.json();
    const error = { msg: json };
    throw error;
}

export async function getAll(token) {
    const response = await fetch(`${API_URL}/products/getAll`, {
        method: 'GET',
        headers: {
            'authorization': `BEARER ${token}`
        }
    });

    if (response.status === 401) {
        const error = { status: 401 };
        throw error;
    } else if (response.status === 200) {
        const json = await response.json();
        return json;
    }

    const json = await response.json();
    const error = { msg: json };
    throw error;
}

export async function deleteProduct(id, token) {
    const response = await fetch(`${API_URL}/products/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'authorization': `BEARER ${token}`
        }
    });

    if (response.status === 401) {
        const error = { status: 401 };
        throw error;
    } else if (response.status === 204) {
        return;
    }

    const json = await response.json();
    const error = { msg: json };
    throw error;
}

export async function getById(id, token) {
    const response = await fetch(`${API_URL}/products/byId/${id}`, {
        method: 'GET',
        headers: {
            'authorization': `BEARER ${token}`
        }
    });

    if (response.status === 401) {
        const error = { status: 401 };
        throw error;
    } else if (response.status === 200) {
        const json = await response.json();
        return json;
    }

    const json = await response.json();
    const error = { msg: json };
    throw error;
}

export async function updateProduct(formData, token) {

    const response = await fetch(`${API_URL}/products/update`, {
        body: formData,
        method: 'PUT',
        headers: {
            'authorization': `BEARER ${token}`,
        },
    });

    if (response.status === 401) {
        const error = { status: 401 };
        throw error;
    } else if (response.status === 200) {
        return;
    }

    const json = await response.json();
    const error = { msg: json };
    throw error;
}

export async function countProduct(token) {

    const response = await fetch(`${API_URL}/products/count`, {
        method: 'GET',
        headers: {
            'authorization': `BEARER ${token}`,
        },
    });

    if (response.status === 401) {
        const error = { status: 401 };
        throw error;
    } else if (response.status === 200) {
        const json = await response.json();
        return json;
    }

    const json = await response.json();
    const error = { msg: json };
    throw error;
}