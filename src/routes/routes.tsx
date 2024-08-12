import { createBrowserRouter, Navigate } from "react-router-dom"
import AdminLayout from "../layouts/admin/AdminLayout";
import Product from "../pages/admin/products/Product";
import CreateProduct from "../pages/admin/products/CreateProduct";
import UpdateProduct from "../pages/admin/products/UpdateProduct";
import UserLayout from "../layouts/user/UserLayout";
import ProductDetail from "../pages/user/products/ProductDetail";
import Provider from "../pages/admin/providers/Provider";
import Cart from "../pages/user/cart/Cart";
import LoginSuccess from "../pages/user/auth/LoginSucess";
import Register from "../pages/user/auth/Register";
import VerifyEmail from "../pages/user/auth/VerifyEmail";
import ProtectRoutes from "./ProtectRoutes";
import { Role } from "../models/user.model";
import Login from "../pages/user/auth/Login";
import Home from "../pages/user/home/Home";
import Dashboard from "../pages/admin/Dashboard";
import Category from "../pages/admin/categories/Category";
import ProductUser from "../pages/user/products/Product";
import ForgotPassword from "../pages/user/auth/ForgotPassword";
import AuthLayout from "../layouts/common/AuthLayout";
import App from "../App";
import PaymentSuccess from "../pages/user/cart/PaymentSuccess";
import Order from "../pages/admin/orders/Order";
import Promotion from "../pages/user/products/Promotion";
import Profile from "../pages/user/profile/Profile";


const adminRoutes = [
    {
        path: '/admin/dashboard',
        element: <Dashboard />
    },
    {
        path: '/admin/product',
        element: <Product />
    },
    {
        path: '/admin/product/create',
        element: <CreateProduct />
    },
    {
        path: '/admin/product/update/:id',
        element: <UpdateProduct />
    },
    {
        path: '/admin/product/category',
        element: <Category/>
    },
    {
        path: '/admin/product/provider',
        element: <Provider/>
    },
    {
        path: '/admin/order',
        element: <Order/>
    },
]

const userRoutes = [
    {
        path: '/profile',
        element: <Profile/>
    },
]

const publicRoutes = [
    {
        path: '/home',
        element: <UserLayout><Home/></UserLayout>
    },
    {
        path: '/products/:id',
        element: <UserLayout><ProductDetail/></UserLayout>
    },
    {
        path: '/cart',
        element: <UserLayout><Cart/></UserLayout>
    },
    {
        path: '/',
        element: <Navigate to={"/home"}></Navigate>
    
    },
    {
        path: '/promotions',
        element: <UserLayout><Promotion/></UserLayout>
    
    },
    {
        path: '/products',
        element: <UserLayout><ProductUser/></UserLayout>
    
    },
    {
        path: '/payment/success',
        element: <UserLayout><PaymentSuccess/></UserLayout>
    },
]

const authRoutes = [
    {
        path: '/auth/login',
        element: <AuthLayout><Login/></AuthLayout>
    
    },
    {
        path: '/auth/login-success',
        element: <LoginSuccess/>
    
    },
    {
        path: '/auth/register',
        element: <AuthLayout><Register/></AuthLayout>
    
    },
    {
        path: '/auth/verify',
        element:<AuthLayout><VerifyEmail/></AuthLayout>
    
    },
    {
        path: '/auth/forgot-password',
        element: <AuthLayout><ForgotPassword/></AuthLayout>
    
    },
]

const adminRoutesRs = adminRoutes.map((route) => {
    return {
        ...route,
        element: <App><ProtectRoutes role={Role.ROLE_ADMIN}><AdminLayout>{route.element}</AdminLayout></ProtectRoutes></App>
    }
}
);

const userRoutesRs = userRoutes.map((route) => {
    return {
       ...route,
        element: <ProtectRoutes role={Role.ROLE_USER}><UserLayout>{route.element}</UserLayout></ProtectRoutes>
    }
});

const publicRoutesRs = publicRoutes.map((route) => {
    return {
        path: route.path,
        element: <App>{route.element}</App>
    }
});



export const router = createBrowserRouter([
    ...adminRoutesRs,
    ...publicRoutesRs,
    ...userRoutesRs,
    ...authRoutes
    
]);