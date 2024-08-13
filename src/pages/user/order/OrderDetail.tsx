import { Box, Button, Container, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OrderDetailModel } from "../../../models/order-detail.model";
import { OrderModel } from "../../../models/order.model";
import { getOrderById, getOrderDetailsByOrderId } from "../../../services/order.service";
import { convertPrice } from "../../../utils/convert-price";
import CartItem from "../cart/CartItem";
import { CartItemModel } from "../../../models/cart-item.model";
import { OrderStatus } from "../../../models/enums/order-status.enum";
import { DeliveryMethod, PaymentMethod } from "../../../dtos/requests/order.dto";

const OrderDetail = () => {
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState<OrderDetailModel[]>([]);
    const [order, setOrder] = useState<OrderModel>();

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

    const getOrderStatusText = (orderStatus: OrderStatus | any) => {
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
            default:
                return ""
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
                return <Button variant="outlined" color="error">Hủy đơn hàng</Button>
            case OrderStatus.SHIPPED:
                return <Button variant="outlined" color="success">Đã nhận được hàng</Button>
            case OrderStatus.DELIVERED:
                return <Button variant="outlined" color="warning">Đánh giá sản phẩm</Button>
            default:
                return;
        }
    }

    return (
        <Container>
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
        </Container>
    );
}

export default OrderDetail;
