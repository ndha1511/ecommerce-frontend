import { Backdrop, Box, CircularProgress, Container, IconButton, InputAdornment, TextField, Typography, useMediaQuery } from "@mui/material";
import { UserRegisterDto } from "../../../dtos/requests/user-register.dto";
import * as yup from 'yup';
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { register } from "../../../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import ButtonGradient from "../../../components/common/ButtonGradient";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

type RegisterForm = UserRegisterDto & {
    confirmPassword: string
}

const validationRegisterSchema = yup.object({
    email: yup.string()
        .required('Vui lòng nhập email')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Email không hợp lệ"),
    password: yup.string()
        .required('Vui lòng nhập mật khẩu').min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
        .required('Vui lòng xác nhận mật khẩu'),
    phoneNumber: yup.string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^0[0-9]{9}$/, "Số điện thoại không hợp lệ"),
    name: yup.string().required("Vui lòng nhập tên")
});

const Register = () => {
    const isMobile: boolean = useMediaQuery('(max-width:768px)');
    const isMedium: boolean = useMediaQuery('(max-width:980px)');
    const [errorEmail, setErrorEmail] = useState("");
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const formikRegister = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            name: ''
        },
        validationSchema: validationRegisterSchema,
        onSubmit: async (values: RegisterForm) => {
            const userRegisterDto: UserRegisterDto = values;
            try {
                setOpen(true);
                await register(userRegisterDto);
                navigate("/auth/verify?email=" + userRegisterDto.email);
            } catch (error) {
                setErrorEmail("Email đã được sử dụng");
                setOpen(false);
            }
        },
    });
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        document.title = "Đăng ký";
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
                    <Typography variant="h6" fontWeight={'bold'}>TẠO TÀI KHOẢN</Typography>

                </Box>
                <TextField
                    sx={{
                        flex: 1
                    }}
                    label="Email"
                    name="email"
                    value={formikRegister.values.email}
                    onChange={(e) => { formikRegister.handleChange(e); setErrorEmail("") }}
                    onBlur={formikRegister.handleBlur}
                    error={formikRegister.touched.email && Boolean(formikRegister.errors.email)}
                    helperText={formikRegister.touched.email ? formikRegister.errors.email : " "}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon/>
                            </InputAdornment>
                        ),
                    }}
                    FormHelperTextProps={{ sx: { minHeight: '20px' } }}
                />
                {formikRegister.touched.email && !formikRegister.errors.email && !errorEmail && <Box sx={{ minHeight: '11px' }}></Box>}
                {errorEmail && <Typography color={"error"} component={"span"} sx={{ minHeight: '11px' }}>{errorEmail}</Typography>}
                <TextField
                    sx={{
                        flex: 1
                    }}
                    label="Họ và tên"
                    name="name"
                    value={formikRegister.values.name}
                    onChange={formikRegister.handleChange}
                    onBlur={formikRegister.handleBlur}
                    error={formikRegister.touched.name && Boolean(formikRegister.errors.name)}
                    helperText={formikRegister.touched.name ? formikRegister.errors.name : " "}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountBoxIcon/>
                            </InputAdornment>
                        ),
                    }}
                    FormHelperTextProps={{ sx: { minHeight: '20px' } }}
                />
                {formikRegister.touched.name && !formikRegister.errors.name && <Box sx={{ minHeight: '11px' }}></Box>}
                <TextField
                    sx={{
                        flex: 1
                    }}
                    label="Số điện thoại"
                    type="tel"
                    name="phoneNumber"
                    value={formikRegister.values.phoneNumber}
                    onChange={formikRegister.handleChange}
                    onBlur={formikRegister.handleBlur}
                    error={formikRegister.touched.phoneNumber && Boolean(formikRegister.errors.phoneNumber)}
                    helperText={formikRegister.touched.phoneNumber ? formikRegister.errors.phoneNumber : " "}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PhoneAndroidIcon/>
                            </InputAdornment>
                        ),
                    }}
                    FormHelperTextProps={{ sx: { minHeight: '20px' } }}
                />
                {formikRegister.touched.phoneNumber && !formikRegister.errors.phoneNumber && <Box sx={{ minHeight: '11px' }}></Box>}
                <TextField
                    sx={{
                        flex: 1
                    }}
                    type={showPassword ? 'text' : 'password'}
                    label="Mật khẩu"
                    name="password"
                    value={formikRegister.values.password}
                    onChange={formikRegister.handleChange}
                    onBlur={formikRegister.handleBlur}
                    error={formikRegister.touched.password && Boolean(formikRegister.errors.password)}
                    helperText={formikRegister.touched.password ? formikRegister.errors.password : " "}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon/>
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
                {formikRegister.touched.password && !formikRegister.errors.password && <Box sx={{ minHeight: '11px' }}></Box>}
                <TextField
                    sx={{
                        flex: 1
                    }}
                    type={showPassword ? 'text' : 'password'}
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    value={formikRegister.values.confirmPassword}
                    onChange={formikRegister.handleChange}
                    onBlur={formikRegister.handleBlur}
                    error={formikRegister.touched.confirmPassword && Boolean(formikRegister.errors.confirmPassword)}
                    helperText={formikRegister.touched.confirmPassword ? formikRegister.errors.confirmPassword : " "}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon/>
                            </InputAdornment>
                        ),
                    }}
                    FormHelperTextProps={{ sx: { minHeight: '20px' } }}
                />
                {formikRegister.touched.confirmPassword && !formikRegister.errors.confirmPassword && <Box sx={{ minHeight: '11px' }}></Box>}
                
                <ButtonGradient variant="contained" onClick={() => formikRegister.submitForm()}>Đăng ký</ButtonGradient>
                <Box>
                    <Link to={"/auth/login"} style={{
                        color: 'blue',
                    }}>Trở về đăng nhập</Link>
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

export default Register;