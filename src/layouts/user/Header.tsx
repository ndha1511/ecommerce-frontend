import { AppBar, Avatar, Badge, Box, Drawer, ListItemButton, Menu, MenuItem, Tooltip, Typography, useMediaQuery } from "@mui/material";
import SearchInput from "../../components/common/search-input/SearchInput";
import IconButtonGradient from "../../components/common/IconButtonGradient";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ExpandLess, ExpandMore, Notifications } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { primaryGradient } from "../../theme";
import MenuIcon from '@mui/icons-material/Menu';
import NavBar from "../common/NavBar";
import { useState } from "react";
import logoIcon from "../../assets/logo/logo-icon.png";
import { userMenu } from "../common/Menu";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { getUserFromLocalStorage, isLogin } from "../../services/user.service";
import ButtonGradient from "../../components/common/ButtonGradient";
import { UserModel } from "../../models/user.model";
import { LoginResponse } from "../../dtos/responses/login-response";
import { getToken } from "../../services/token.service";
import { lougout, removeLocalStorage } from "../../services/auth.service";



const Header = () => {
    const location = useLocation();
    const isMobile: boolean = useMediaQuery('(max-width:600px)');
    const isMedium: boolean = useMediaQuery('(max-width:1150px)');
    const login: boolean = isLogin();
    const user: UserModel | null = getUserFromLocalStorage();
    const [open, setOpen] = useState(false);
    const [openChildItem, setOpenChildItem] = useState<{ [key: string]: boolean }>({});
    const cart = useSelector((state: RootState) => state.cart.items);
    const notifications = useSelector((state: RootState) => state.notification.items);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [anchorE2, setAnchorE2] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const openE2 = Boolean(anchorE2);
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };
    const handleClick = (title: string) => {
        setOpenChildItem(prev => ({ ...prev, [title]: !prev[title] }));
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClose2 = () => {
        setAnchorE2(null);
    };
    const handleClickAvatar = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClickNotify = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorE2(event.currentTarget);
    };

    const DrawerList = (
        <NavBar items={userMenu}></NavBar>
    );

    const handleLogout = async () => {
        const token: LoginResponse | null = getToken();
        if (token) {
            try {
                await lougout(token.accessToken);
                removeLocalStorage();
                navigate("/");
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleSearch = (name: string) => {
        window.location.href = `/products?pageNo=1&search=productName:${name}`;
    }

    return (
        <AppBar elevation={0} color="secondary" sx={{
            display: 'flex',
            width: '100%',
            gap: '60px',
            alignItems: 'center',
            flexDirection: 'row',
            padding: '10px',
            pl: isMobile ? 1 : 6,
            pr: isMobile ? 2 : 6,
            backgroundColor: "background.paper"
        }}>

            <Box sx={{ flex: isMobile ? 1 : '', display: 'flex', alignItems: 'center' }}>
                {isMedium || isMobile ? <Box>
                    <IconButtonGradient onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButtonGradient>
                    <Drawer open={open} onClose={toggleDrawer(false)}>
                        {DrawerList}
                    </Drawer>
                </Box> : <></>}
                <img src={logoIcon} alt={"logo"} width={"55px"} height={"55px"} />
            </Box>
            {!isMobile && !isMedium ? <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                alignItems: 'center',
                padding: '10px',
            }}>
                {userMenu.map((item: any, index: number) => {
                    const isOpen = openChildItem[item.title] || false;
                    return (
                        <ListItemButton key={index} component={Link} to={item.href} sx={{
                            display: "flex",
                            ':hover': {
                                background: primaryGradient,
                                color: 'white'
                            },
                            background: location.pathname.startsWith(item.href) ? primaryGradient : 'none',
                            color: location.pathname.startsWith(item.href) ? 'white' : 'none',
                            textDecoration: 'none',
                            pl: 1, pr: 1,

                        }} onClick={() => handleClick(item.title)}>
                            <Typography>{item.title}</Typography>
                            {item.child ? isOpen ? <ExpandLess /> : <ExpandMore /> : <></>}
                        </ListItemButton>
                    )
                })}
            </Box> : <></>}
            {!isMobile && <Box sx={{ flex: 1 }}>
                <SearchInput placeHolder="Tìm kiếm sản phẩm" handleSearch={handleSearch}/>
            </Box>}
            <Box sx={{
                display: 'flex',
                gap: '15px',
            }}>
                <Tooltip title="giỏ hàng">
                    <IconButtonGradient onClick={() => navigate('/cart')}>
                        <Badge badgeContent={cart.length} color="primary">
                            <ShoppingCartIcon fontSize="small" />
                        </Badge>
                    </IconButtonGradient>
                </Tooltip>
                <Tooltip title="thông báo">
                    <IconButtonGradient onClick={handleClickNotify}>
                        <Badge badgeContent={notifications.length} color="primary">
                            <Notifications fontSize="small" />
                        </Badge>
                    </IconButtonGradient>
                </Tooltip>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorE2}
                    open={openE2}
                    onClose={handleClose2}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    {notifications.map((notification) =>
                        <MenuItem key={notification.id}>
                            {notification.content}
                        </MenuItem>)}
                </Menu>
                {login ? <><Tooltip title={user ? user.name : "tài khoản"}>
                    <IconButtonGradient onClick={handleClickAvatar}>
                        <Avatar alt={user?.name} src={user?.avatarUrl} sx={{
                            width: 23,
                            height: 23,
                        }} />
                        <></>
                    </IconButtonGradient>
                </Tooltip>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => navigate('/profile')}>Thông tin cá nhân</MenuItem>
                        <MenuItem>Đơn hàng của tôi</MenuItem>
                        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                    </Menu>
                </> :
                    <ButtonGradient variant="contained"
                        onClick={() => {
                            localStorage.setItem("historyPath", location.pathname);
                            navigate('/auth/login', { state: { from: location.pathname } });
                        }}
                        size="small"
                    >Đăng nhập</ButtonGradient>}
            </Box>
        </AppBar>
    )
}

export default Header;