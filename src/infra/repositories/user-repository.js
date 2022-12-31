import { API_URL } from '../../settings.js';

export async function postLogin(login, password) {
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
}

export async function postCreateUser(name, login, password, token) {
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
    
    if (response.status === 401) {
        const error = { status: 401 };
        throw error;
    } else if (response.status === 201)
        return true;

    const json = await response.json();
    let error = {
        msg: json
    };
    throw error;
}

export async function getAll(token) {
    const response = await fetch(`${API_URL}/users/getAll`, {
        method: 'GET',
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
}

export async function deleteUser(id, token) {
    const response = await fetch(`${API_URL}/users/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'authorization': `BEARER ${token}`
        },
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

export async function getUserById(id, token) {
    const response = await fetch(`${API_URL}/users/getById/${id}`, {
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

export async function getUserByToken(token) {
    const response = await fetch(`${API_URL}/users/getByToken`, {
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

export async function updateUser(id, name, login, password, token) {

    const data = {
        'id_user': id,
        'name': name,
        'login': login,
        'password': password,
    };

    const response = await fetch(`${API_URL}/users/edit`, {
        body: JSON.stringify(data),
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
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