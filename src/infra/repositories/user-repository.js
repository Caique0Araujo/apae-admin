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
        if (response.status !== 200) {
            let error = {
                msg: json
            };
            throw error;
        }

        return json;
    } catch (ex) {
        throw ex;
    }
}

export async function postCreateUser(name, login, password, token) {
    try {
        const data = {
            'name': name,
            'login': login,
            'password': password
        };

        const requestData = {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `BEARER ${token}`,
            }
        }

        const response = await fetch(`${API_URL}/users/create`, requestData);
        if (response.status === 201)
            return true;

        const json = await response.json();
        let error = {
            msg: json
        };
        throw error;
    } catch (ex) {
        throw ex;
    }
}