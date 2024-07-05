import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginResponse } from "../../../dtos/responses/login-response";
import { saveToken } from "../../../services/token.service";
import { UserModel } from "../../../models/user.model";
import { getUserByEmail, saveUserToLocalStorage } from "../../../services/user.service";
import { ResponseSuccess } from "../../../dtos/responses/response.success";

const LoginSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get("accessToken");
    const refreshToken = queryParams.get("refreshToken");
    const email = queryParams.get("email");
    useEffect(() => {
        (async () => {
            if(accessToken && refreshToken && email) {
                const loginResponse: LoginResponse = {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
                try {
                    saveToken(loginResponse);
                    const response: ResponseSuccess<UserModel> = await getUserByEmail(email);
                    const user: UserModel = response.data;
                    saveUserToLocalStorage(user);
                } catch (error) {
                    navigate("/auth/login");
                }
                navigate("/home");
            } else {
                navigate("/auth/login");
            }
        })();
    }, []);
    return null;
}

export default LoginSuccess;