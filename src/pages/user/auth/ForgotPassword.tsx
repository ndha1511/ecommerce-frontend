import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container, TextField, useMediaQuery } from '@mui/material';
import { getVeriryCode, resetPassword, verifyResetPassword } from '../../../services/auth.service';
import { VerifyEmailDto } from '../../../dtos/requests/verify-email.dto';
import { ResetPasswordRequest } from '../../../dtos/requests/reset-password-request';
import { ResponseSuccess } from '../../../dtos/responses/response.success';
import { UserModel } from '../../../models/user.model';
import { getUserByEmail, saveUserToLocalStorage } from '../../../services/user.service';
import { saveToken } from '../../../services/token.service';
import { LoginResponse } from '../../../dtos/responses/login-response';
import { useNavigate } from 'react-router-dom';

const steps = ['Nhập email', 'Nhập mã xác thực', 'Cập nhật mật khẩu'];

export default function ForgotPassword() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [email, setEmail] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();
    const isMobile: boolean = useMediaQuery('(max-width:768px)');
    const isMedium: boolean = useMediaQuery('(max-width:980px)');

    React.useEffect(() => {
        document.title = "Quên mật khẩu";
    }, []);

    const handleStep1 = async () => {
        try {
            await getVeriryCode(email);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } catch (error) {
            console.log(error);
        }
    };

    const handleStep2 = async () => {
        try {
            const verifyEmail: VerifyEmailDto = {
                email: email,
                otp: otp
            }
            await verifyResetPassword(verifyEmail);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFinish = async () => {
        try {
            const resetPasswordRequest: ResetPasswordRequest = {
                email: email,
                otpResetPassword: otp,
                password: password 
            }
            const response: ResponseSuccess<LoginResponse> = await resetPassword(resetPasswordRequest);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            saveToken(response.data);
            const responseUser: ResponseSuccess<UserModel> = await getUserByEmail(email);
            saveUserToLocalStorage(responseUser.data);
            navigate("/home");
        } catch (error) {
            console.log(error);
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const renderBody = () => {
        if (activeStep === 0) {
            return (
                <Box sx={{ mt: 2 }}>
                    <Typography>Vui lòng nhập email của bạn:</Typography>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="normal"
                        required
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Button
                        color="inherit"
                        onClick={handleBack}
                        disabled={true}
                        sx={{ mr: 1 }}
                    >
                        Back
                    </Button>
                    <Button onClick={handleStep1}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Box>
            )
        }
        else if (activeStep === 1) {
            return (
                <Box sx={{ mt: 2 }}>
                    <Typography>Vui lòng nhập mã xác thực đã gửi đến email của bạn:</Typography>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="normal"
                        required
                        type="text"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                    />
                    <Button
                        color="inherit"
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                    >
                        Back
                    </Button>
                    <Button onClick={handleStep2}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Box>
            )
        } else {
            return (
                <Box sx={{ mt: 2 }}>
                    <Typography>Vui lòng nhập mật khẩu mới:</Typography>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="normal"
                        required
                        value={password}
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button
                        color="inherit"
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                    >
                        Back
                    </Button>
                    <Button onClick={handleFinish}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Box>
            )
        }


    }

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
            <Stepper activeStep={activeStep}>
                {steps.map((label) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                        optional?: React.ReactNode;
                    } = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {renderBody()}
            </Box>

        </Container>
    );
}