import { ReactNode } from "react";
import { Role } from "../models/user.model";
import { isLogin } from "../services/user.service";
import { Navigate } from "react-router-dom";

const ProtectRoutes = ({role, children}: {role?: Role, children: ReactNode}) => {
    
    return isLogin(role) ? children : <Navigate to={"/auth/login"}></Navigate>;
}

export default ProtectRoutes;