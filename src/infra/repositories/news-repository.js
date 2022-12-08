import { API_URL } from '../../settings.js';

export async function createNews(formData, token) {
    const response = await fetch(`${API_URL}/news/create`, {
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