import { Box, Button, Container, Typography, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OrderDetailModel } from "../../../models/order-detail.model";
import { OrderModel } from "../../../models/order.model";
import { getOrderById, getOrderDetailsByOrderId, updateStatusOrder } from "../../../services/order.service";
import { convertPrice } from "../../../utils/convert-price";
import CartItem from "../cart/CartItem";
import { CartItemModel } from "../../../models/cart-item.model";
import { OrderStatus } from "../../../models/enums/order-status.enum";
import { DeliveryMethod, PaymentMethod } from "../../../dtos/requests/order.dto";
import AlertCustom from "../../../components/common/AlertCustom";
import { getVnpPaymentUrl } from "../../../services/payment.service";
import DialogRating from "./DialogRating";

export const getOrderStatusText = (orderStatus: OrderStatus | any) => {
    switch (orderStatus) {
        case OrderStatus.PENDING:
            return "Đang chờ xử lý"
        case OrderStatus.PROCESSING:
            return "Đang xử lý"
        case OrderStatus.SHIPPED:
            return "Đã giao hàng"
        case OrderStatus.DELIVERED:
            return "Đã nhận hàng"
        case OrderStatus.CANCELLED:
            return "Đã hủy"
        case OrderStatus.PAID:
            return "Đã thanh toán"
        case OrderStatus.UNPAID:
            return "Chưa thanh toán"
        default:
            return ""
    }
}

const OrderDetail = () => {
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState<OrderDetailModel[]>([]);
    const [order, setOrder] = useState<OrderModel>();
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const [openAlert, setOpenAlert] = useState({
        show: false,
        status: '',
        message: ''
    });

    useEffect(() => {
        if (id) {
            (async () => {
                try {
                    const response = await getOrderDetailsByOrderId(id);
                    setOrderDetails(response.data);
                    const response2 = await getOrderById(id);
                    setOrder(response2.data);
                } catch (error) {
                    console.log(error);
                }
            })();
        }
    }, [id]);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const updateOrder = async (orderStatus: OrderStatus, text: string) => {
        try {
            const response = await updateStatusOrder(order?.id || "", {
                status: orderStatus
            });
            setOrder(response.data);
            setOpenAlert({
                show: true,
                status: 'success',
                message: text
            });
            handleClose();
        } catch (error) {
            setOpenAlert({
                show: true,
                status: 'error',
                message: 'Thất bại'
            });
            handleClose();
        }
    }

    

    const getDeliveryMethodText = (deliveryMethod: DeliveryMethod | any) => {
        switch (deliveryMethod) {
            case DeliveryMethod.ECONOMY:
                return "Giao hàng tiết kiệm"
            default:
                return "Giao hàng nhanh"
        }
    }

    const getPaymentMethodText = (paymentMethod: PaymentMethod | any) => {
        switch (paymentMethod) {
            case PaymentMethod.COD:
                return "Thanh toán khi nhận hàng"
            default:
                return "Thanh toán bằng ví điện tử"
        }
    }

    const renderButtonWithOrderStatus = (orderStatus: OrderStatus | any) => {
        switch (orderStatus) {
            case OrderStatus.PENDING:
                return <Button variant="outlined" color="error" onClick={handleClickOpen}>Hủy đơn hàng</Button>
            case OrderStatus.SHIPPED:
                return <Button variant="outlined" color="success" onClick={() => updateOrder(OrderStatus.DELIVERED, "Cập nhật đơn hàng thành công")}>Đã nhận được hàng</Button>
            case OrderStatus.DELIVERED:
                return <Button variant="outlined" color="warning" onClick={() => setOpenDialog(true)}>Đánh giá sản phẩm</Button>
            case OrderStatus.UNPAID:
                return <>
                    <Button variant="outlined" color="error" onClick={handleClickOpen}>Hủy đơn hàng</Button>
                    <Button variant="outlined" color="info" onClick={paymentOnline}>Thanh toán</Button>
                </>
            default:
                return;
        }
    }

    const colseAlert = () => {
        setOpenAlert({ show: false, status: '', message: '' });
    }

    const paymentOnline = async () => {
        const paymentUrl: string = (await getVnpPaymentUrl(order?.id || "", order?.discountedAmount || 0)).data;
        location.href = paymentUrl;
    }

    const handleCloseRatingDialog = () => {
        setOpenDialog(false);
    }

    useEffect(() => {
        document.title = "Chi tiết đơn hàng";
    }, []);

    return (
        <Container>
            {openAlert.show && <AlertCustom alert={openAlert} colseAlert={colseAlert} />}
            {openDialog && <DialogRating openDialog={openDialog} handleClose={handleCloseRatingDialog} orderDetails={orderDetails}/>}
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                Chi tiết đơn hàng
            </Typography>
            <Box sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1">
                            Mã đơn hàng: {order?.id}
                        </Typography>
                        <Typography variant="subtitle1">
                            Ngày đặt hàng: {order?.orderDate.toString()}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1">
                            Phương thức vận chuyển: {getDeliveryMethodText(order?.deliveryMethod)}
                        </Typography>
                        <Typography variant="subtitle1">
                            Phương thức thanh toán: {getPaymentMethodText(order?.paymentMethod)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1">
                            Tổng tiền: {convertPrice(order?.originalAmount)}
                        </Typography>
                        <Typography variant="subtitle1">
                            Phí vận chuyển: {convertPrice(order?.deliveryAmount)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1">
                            Giảm giá: {convertPrice(order?.discountedPrice)}
                        </Typography>
                        <Typography variant="subtitle1">
                            Trạng thái: {getOrderStatusText(order?.orderStatus)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            Số tiền phải thanh toán: {convertPrice(order?.discountedAmount)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                            {orderDetails.map((detail, index) => {
                                const cartItem: CartItemModel = {
                                    productDetail: detail.productDetail,
                                    quantity: detail.quantity,
                                }
                                return <CartItem key={index} hiddenButton={true} item={cartItem} />
                            })}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
                            {renderButtonWithOrderStatus(order?.orderStatus)}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Xác nhận hủy đơn hàng"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc muốn hủy đơn hàng này ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error" variant="outlined">Từ chối</Button>
                    <Button onClick={() => updateOrder(OrderStatus.CANCELLED, "Hủy đơn hàng thành công")} color="success" variant="outlined">
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default OrderDetail;
