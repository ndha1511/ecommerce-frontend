import { Box, Button, Container, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import CartEmpty from "./CartEmpty";
import CartItem from "./CartItem";
import { useEffect, useState } from "react";
import { convertPrice } from "../../../utils/convert-price";
import { CartItemModel } from "../../../models/cart-item.model";
import { isLogin } from "../../../services/user.service";
import { useNavigate } from "react-router-dom";


const Cart = () => {
    const cart = useSelector((state: RootState) => state.cart.items);
    const [totalMoney, setTotalMoney] = useState<number>(0);
    const navigate = useNavigate();
   


    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        document.title = "Giỏ hàng";
    }, []);

    useEffect(() => {
        let total = 0;
        cart.forEach((cartItem: CartItemModel) => {
            let price: number = cartItem.productDetail.product?.price || 0;
            if (cartItem.discountedPrice) {
                price = cartItem.discountedPrice;
            }
            total += price * (cartItem.quantity ?? 0);
        });
        setTotalMoney(total);
    }, [cart]);

    const handleCheckout = () => {
        if (!isLogin()) {
            localStorage.setItem("historyPath", location.pathname);
            navigate('/auth/login', { state: { from: '/cart' } });
        }
        navigate("/payment");
    };


    return (
        <Container sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: isMobile ? 1 : 2,
            maxWidth: 'lg',
            mx: 'auto'
        }}>
            {cart.length > 0 ?
                <>
                    <Typography variant="h5">Giỏ hàng</Typography>
                    <Box sx={{
                        maxHeight: isMobile ? '40vh' : '50vh',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mb: 2,
                        mt: 2
                    }}>
                        {cart.map((cartItem: CartItemModel, index: number) => (
                            <CartItem key={index} item={cartItem} />
                        ))}
                    </Box>
                    <Box sx={{
                        mb: 2
                    }}>
                        <Typography variant={isMobile ? 'body2' : 'h6'}>
                            Tổng tiền: {convertPrice(totalMoney)}
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <Button
                            onClick={handleCheckout}
                            variant="outlined"
                            color="primary"
                            fullWidth={isMobile}
                        >
                            Thanh toán
                        </Button>
                    </Box>

                </>
                :
                <CartEmpty />}
        </Container>
    );
};

export default Cart;
