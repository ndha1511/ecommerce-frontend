import { LoginResponse } from "../dtos/responses/login-response";
import { decrypt, encrypt } from "../utils/crypt-data";

export const saveToken = (loginResponse: LoginResponse) => {
    const encryptToken: string = encrypt(JSON.stringify(loginResponse))
    localStorage.setItem('token', encryptToken);
}

export const getToken = (): LoginResponse | null => {
    const token = localStorage.getItem('token');
    if (token) {
        const decryptToken: string = decrypt(token);
        if(decryptToken !== "") {
            return JSON.parse(decryptToken);
        }
    }
    return null;
}

