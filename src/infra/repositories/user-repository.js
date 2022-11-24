export async function postLogin(login, password) {
    try {
        const data = {
            'login': login,
            'password': password
        };

        const response = await fetch('http://localhost:3333/auth/login', {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();
        if (response.status != 200) {
            throw { msg: json };
        }

        return json;
    } catch (ex) {
        throw ex;
    }
}