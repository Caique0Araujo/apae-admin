import { setCookie } from "react-use-cookie";

export function invalidToken(navigate) {
    setCookie('token', '', { path: '/' });
    navigate('/');
    window.location.reload(false);
}