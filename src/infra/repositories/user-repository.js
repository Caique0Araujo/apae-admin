import { API_URL } from '../../settings.js';

export async function postLogin(login, password) {
    try {
        const data = {
            'login': login,
            'password': password
        };

        const requestData = {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const response = await fetch(`${API_URL}/users/login`, requestData);
        const json = await response.json();
        if (response.status != 200) {
            throw { msg: json };
        }

        return json;
    } catch (ex) {
        throw ex;
    }
}