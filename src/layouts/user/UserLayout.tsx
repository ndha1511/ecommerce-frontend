import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";
import { isLogin } from "../../services/user.service";
import MessageBox from "../../pages/user/chat/MessageBox";

type Props = {
    children?: ReactNode;
}

const UserLayout = ({ children }: Props) => {
    const login: boolean = isLogin();
    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: '100vh' }}>
            <Header />
            <Box sx={{ flex: 1, marginTop: '85px', display: 'flex', alignItems: 'center' }}>
                {children}
            </Box>
            {login &&  <MessageBox/>}
            <Box sx={{ height: '60px' }}><Footer></Footer></Box>
        </Box>
    )
}

export default UserLayout;