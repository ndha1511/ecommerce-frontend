import requestConfig, { ContentType, Method } from "../configurations/axios.config";
import { ChangePasswordRequest } from "../dtos/requests/change-password-request";
import { UserUpdateDto } from "../dtos/requests/user-update.dto";
import { LoginResponse } from "../dtos/responses/login-response";
import { ResponseSuccess } from "../dtos/responses/response.success";
import { Role, UserModel } from "../models/user.model";
import { decrypt, encrypt } from "../utils/crypt-data";
import { saveToken } from "./token.service";


export const getUserByEmail = async (email: string): Promise<ResponseSuccess<UserModel>> => {
    try {
        const response = await requestConfig(
            `users/${email}`,
            Method.GET,
            [],
            ContentType.JSON,
            true
        );
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const saveUserToLocalStorage = (user: UserModel) => {
    const encryptUser: string = encrypt(JSON.stringify(user));
    localStorage.setItem('user', encryptUser);
}

export const isLogin = (role?: Role): boolean => {
    const user: UserModel | null = getUserFromLocalStorage();
    if (user) {
        return role ? user.role === role : true;
    }
    return false;
}

export const getUserFromLocalStorage = (): UserModel | null => {
    const userStr: string | null = localStorage.getItem('user');
    if (userStr) {
        const decryptUser: string = decrypt(userStr);
        if (decryptUser !== "") {
            return JSON.parse(decryptUser);
        }
    }
    return null;
}

export const updateUser = async (email: string, userUpdateDto: UserUpdateDto): Promise<ResponseSuccess<UserModel>> => {
    try {
        const response = await requestConfig(
            `users/${email}`,
            Method.PUT,
            userUpdateDto,
            ContentType.JSON,
            true
        );
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const uploadAvt = async (avatar: File): Promise<ResponseSuccess<string>> => {
    const formData: FormData = new FormData();
    formData.append('avatar', avatar);
    try {
        const response = await requestConfig(
            `users/upload`,
            Method.POST,
            formData,
            ContentType.FORM_DATA,
            true
        );
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const changePassword = async (changePasswordRequest: ChangePasswordRequest): Promise<ResponseSuccess<LoginResponse>> => {
    try {
        const response = await requestConfig(
            `users/change-password`,
            Method.POST,
            changePasswordRequest,
            ContentType.JSON,
            true
        );
        saveToken(response.data.data);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}
