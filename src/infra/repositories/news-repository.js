import { API_URL } from '../../settings.js';

export async function createNews(formData, token) {
    const response = await fetch(`${API_URL}/news/create`, {
        body: formData,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
            'authorization': `BEARER ${token}`
        },
    });

    console.log(response);
    if (response.status === 200) {
        return;
    }

}