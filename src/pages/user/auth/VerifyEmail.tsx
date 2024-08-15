import { Box, Button, Container, TextField, Typography, useColorScheme, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { VerifyEmailDto } from "../../../dtos/requests/verify-email.dto";
import { ResponseSuccess } from "../../../dtos/responses/response.success";
import { LoginResponse } from "../../../dtos/responses/login-response";
import { verifyEmail } from "../../../services/auth.service";
import { saveToken } from "../../../services/token.service";
import { UserModel } from "../../../models/user.model";
import { getUserByEmail, saveUserToLocalStorage } from "../../../services/user.service";
import ButtonGradient from "../../../components/common/ButtonGradient";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const { mode } = useColorScheme();
    const isMobile: boolean = useMediaQuery('(max-width:768px)');
    const isMedium: boolean = useMediaQuery('(max-width:980px)');

    useEffect(() => {
        if (!email) {
            navigate("/auth/register");
        }
    }, []);

    useEffect(() => {
        document.title = "Xác thực email";
    }, []);

    const hanlderSubmit = async () => {
        if (!otp) {
            setError("vui lòng nhập mã xác thực");
            return;
        }
        const verifyEmailDto: VerifyEmailDto = {
            email: email ?? "",
            otp
        }
        try {
            const response: ResponseSuccess<LoginResponse> = await verifyEmail(verifyEmailDto);
            saveToken(response.data);
            const responseUser: ResponseSuccess<UserModel> = await getUserByEmail(email ?? "");
            saveUserToLocalStorage(responseUser.data);
            navigate("/home");
        } catch (error) {
            setError("mã xác thực không chính xác")
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
                backgroundColor: mode === "dark" ? "common.black" : "common.white",
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
                    <Typography variant="h6" fontWeight={'bold'}>MÃ XÁC THỰC ĐÃ ĐƯỢC GỬI TỚI EMAIL CỦA BẠN</Typography>

                </Box>
                <TextField
                    sx={{
                        flex: 1
                    }}
                    label="Nhập mã xác thực"
                    name="email"
                    value={otp}
                    onChange={(e) => {setOtp(e.target.value); setError("")}}
                />
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2
                }}>
                    <Typography color={"error"} component={"span"} sx={{ minHeight: '20px' }}>{error}</Typography>
                    <Button>Gửi lại mã</Button>
                </Box>

                <ButtonGradient variant="contained" onClick={hanlderSubmit} sx={{ mt: 3 }}>Xác nhận</ButtonGradient>
            </Box>
        </Container>
    )
}
export default VerifyEmail;