import {
    Backdrop,
    Box,
    CircularProgress,
    Container,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery
} from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { login, loginWithSocial } from "../../../services/auth.service";
import * as yup from 'yup';
import { useFormik } from "formik";
import { LoginRequestDto } from "../../../dtos/requests/login-request.dto";
import { ResponseSuccess } from "../../../dtos/responses/response.success";
import { LoginResponse } from "../../../dtos/responses/login-response";
import { saveToken } from "../../../services/token.service";
import { getUserByEmail, saveUserToLocalStorage } from "../../../services/user.service";
import { Role, UserModel } from "../../../models/user.model";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ButtonGradient from "../../../components/common/ButtonGradient";

const validationLoginSchema = yup.object({
    email: yup.string().required('Vui lòng nhập email'),
    password: yup.string().required('Vui lòng nhập mật khẩu'),
});

const Login = () => {
    const isMobile: boolean = useMediaQuery('(max-width:768px)');
    const isMedium: boolean = useMediaQuery('(max-width:980px)');
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const formikLogin = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationLoginSchema,
        onSubmit: async (values: LoginRequestDto) => {
            try {
                setOpen(true);
                const response: ResponseSuccess<LoginResponse> = await login(values);
                saveToken(response.data);
                const responseUser: ResponseSuccess<UserModel> = await getUserByEmail(values.email);
                saveUserToLocalStorage(responseUser.data);
                if (responseUser.data.role === Role.ROLE_ADMIN) {
                    navigate("/admin/dashboard");
                } else {
                    const from = location.state?.from || "/home";
                    navigate(from);
                }

            } catch (error) {
                setOpen(false);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setError("email hoặc mật khẩu không chính xác");
            }

        },
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        document.title = "Đăng nhập";
    }, []);

    return (
        <Container sx={{
            height: '100vh',
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Box sx={{
                width: isMedium ? '65%' : '40%',
                flexGrow: isMobile ? 1 : 0,
                display: "flex",
                justifyContent: 'center',
                backgroundColor: "common.black",
                p: 3,
                gap: '12px',
                flexDirection: "column",
                borderRadius: '12px'
            }}>
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 1,
                    mb: 1
                }}>

                    <Typography variant="h6" fontWeight={'bold'}>ĐĂNG NHẬP</Typography>

                </Box>
                <TextField
                    sx={{
                        flex: 1
                    }}
                    label="Email"
                    name="email"
                    value={formikLogin.values.email}
                    onChange={e => { formikLogin.handleChange(e); setError("") }}
                    onBlur={formikLogin.handleBlur}
                    error={formikLogin.touched.email && Boolean(formikLogin.errors.email)}
                    helperText={formikLogin.touched.email ? formikLogin.errors.email : " "}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon />
                            </InputAdornment>
                        ),
                    }}
                    FormHelperTextProps={{ sx: { minHeight: '20px' } }}
                />
                {formikLogin.touched.email && !formikLogin.errors.email && <Box sx={{ minHeight: '11px' }}></Box>}
                <TextField
                    sx={{
                        flex: 1
                    }}
                    type={showPassword ? 'text' : 'password'}
                    label="Mật khẩu"
                    name="password"
                    value={formikLogin.values.password}
                    onChange={e => { formikLogin.handleChange(e); setError("") }}
                    onBlur={formikLogin.handleBlur}
                    error={formikLogin.touched.password && Boolean(formikLogin.errors.password)}
                    helperText={formikLogin.touched.password ? formikLogin.errors.password : " "}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    FormHelperTextProps={{ sx: { minHeight: '20px' } }}
                />
                {formikLogin.touched.password && !formikLogin.errors.password && <Box sx={{ minHeight: '11px' }}></Box>}
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Typography component={"span"} color={"error"}>{error}</Typography>

                    <Link to={"/auth/forgot-password"} style={{
                        color: 'blue',
                        textDecoration: 'none'
                    }}>Quên mật khẩu</Link>
                </Box>
                <ButtonGradient variant="contained" onClick={() => formikLogin.submitForm()}>Đăng nhập</ButtonGradient>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Typography>Hoặc đăng nhập với</Typography>
                </Box>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    gap: '6px',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Tooltip title="facebook">
                        <IconButton onClick={() => loginWithSocial('facebook')} size="large" >
                            <FacebookIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="google">
                        <IconButton onClick={() => loginWithSocial('google')} size="large">
                            <GoogleIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box sx={{
                    width: '100%',
                    mt: 2,
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Typography>Bạn chưa có tài khoản?</Typography>
                    <Link to={"/auth/register"} style={{
                        color: 'blue',
                        textDecoration: 'none'
                    }}>Đăng ký ngay</Link>
                </Box>
            </Box>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    )
}

export default Login;
