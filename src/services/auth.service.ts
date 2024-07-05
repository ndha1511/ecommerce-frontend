import { apiUrl } from "../configurations/api-url"
import requestConfig, { ContentType, Method } from "../configurations/axios.config";
import { LoginRequestDto } from "../dtos/requests/login-request.dto"
import { UserRegisterDto } from "../dtos/requests/user-register.dto";
import { VerifyEmailDto } from "../dtos/requests/verify-email.dto";
import { LoginResponse } from "../dtos/responses/login-response";
import { ResponseSuccess } from "../dtos/responses/response.success";

export const login = async (loginRequestDto: LoginRequestDto): Promise<ResponseSuccess<LoginResponse>> => {
    try {
        const response = await requestConfig(
            `auth/login`,
            Method.POST,
            loginRequestDto,
            ContentType.JSON
        );
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const register = async (userRegisterDto: UserRegisterDto): Promise<ResponseSuccess<string>> => {
    try {
        const response = await requestConfig(
            `auth/register`,
            Method.POST,
            userRegisterDto,
            ContentType.JSON
        );
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const verifyEmail = async (verifyEmailDto: VerifyEmailDto): Promise<ResponseSuccess<LoginResponse>> => {
    try {
        const response = await requestConfig(
            `auth/verify-email`,
            Method.POST,
            verifyEmailDto,
            ContentType.JSON
        );
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const loginWithSocial = (provider: string) => {
    window.location.href = `${apiUrl}/oauth2/authorization/${provider}`
}

