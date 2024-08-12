import { Box, Button, Container, Typography, useMediaQuery, useTheme, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import CartEmpty from "./CartEmpty";
import CartItem from "./CartItem";
import { useEffect, useState } from "react";
import { convertPrice } from "../../../utils/convert-price";
import { CartItemModel } from "../../../models/cart-item.model";
import { isLogin } from "../../../services/user.service";
import { useNavigate } from "react-router-dom";
import Payment from "./Payment";

const Cart = () => {
    const cart = useSelector((state: RootState) => state.cart.items);
    const [totalMoney, setTotalMoney] = useState<number>(0);
    const navigate = useNavigate();
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);


    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        let total = 0;
        cart.forEach((cartItem: CartItemModel) => {
            let price: number = cartItem.productDetail.product?.price || 0;
            if(cartItem.discountedPrice) {
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
        setShowPaymentDialog(true);
    };

    const handleCloseDialog = () => {
        setShowPaymentDialog(false);
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
                    <Box sx={{
                        maxHeight: isMobile ? '40vh' : '50vh',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mb: 2
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
                    <Button
                        onClick={handleCheckout}
                        variant="contained"
                        color="primary"
                        fullWidth={isMobile}
                    >
                        Thanh toán
                    </Button>
                    <Dialog
                        open={showPaymentDialog}
                        onClose={handleCloseDialog}
                        fullWidth
                        maxWidth="md"
                    >
                        <DialogTitle>Thanh toán</DialogTitle>
                        <DialogContent>
                            <Payment />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary">
                                Đóng
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
                :
                <CartEmpty />}
        </Container>
    );
};

export default Cart;
