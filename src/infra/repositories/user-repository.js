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

export async function postGetAll(token) {
    try {
        const response = await fetch(`${API_URL}/users/getAll`, {
            headers: {
                'authorization': `BEARER ${token}`
            }
        });

        if (response.status === 401) {
            const error = { status: 401 };
            throw error;
        }
    
        if (response.status === 204) {
            return [];
        }
    
        const data = await response.json();
        return data;
    } catch (ex) {
        throw ex;
    }
}

export async function deleteUser(id, token) {
    try {
        throw { msg: 'Ocorreu um problema ao excluir o usuário' };
    } catch (ex) {
        throw ex;
    }
}

export async function getUserById(id, token) {
    try {
        throw { msg: 'Ocorreu um problema ao buscar os dados do usuário.' };
    } catch (ex) {
        throw ex;
    }
}