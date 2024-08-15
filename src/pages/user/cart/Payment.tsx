import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from 'yup';
import { UserModel } from "../../../models/user.model";
import { getUserFromLocalStorage } from "../../../services/user.service";
import { DeliveryMethod, OrderDto, PaymentMethod } from "../../../dtos/requests/order.dto";
import { CartItemModel } from "../../../models/cart-item.model";
import { getCartLocalStorage } from "../../../utils/cart-handle";
import { createOrder } from "../../../services/order.service";
import { useEffect, useState } from "react";
import { VoucherModel, VoucherType } from "../../../models/voucher.model";
import { ResponseSuccess } from "../../../dtos/responses/response.success";
import { OrderModel } from "../../../models/order.model";
import { getVnpPaymentUrl } from "../../../services/payment.service";
import CartItem from "./CartItem";
import { convertPrice } from "../../../utils/convert-price";
import VoucherDialog from "./VoucherDialog";
import VoucherView from "./VoucherView";
import AlertCustom from "../../../components/common/AlertCustom";

const validationOrderSchema = yup.object({
    phoneNumber: yup.string().required("Vui lòng nhập số điện thoại nhận hàng")
        .matches(/^0[0-9]{9}$/, "Số điện thoại không hợp lệ"),
    buyerName: yup.string().required("Vui lòng nhập tên người nhận hàng"),
});

const Payment = () => {
    const user: UserModel | null = getUserFromLocalStorage();
    const cart: CartItemModel[] = getCartLocalStorage();
    const [openDialog, setOpenDialog] = useState(false);
    const [vouchersApply, setVouchersApply] = useState<VoucherModel[]>([]);
    const [deliveryPrice, setDeliverPrice] = useState<number>(15000);
    const [totalMoney, setTotalMoney] = useState<number>(0);
    const [discountedPrice, setDiscountedPrice] = useState<number>(0);
    const [discountedDeliverPrice, setDiscountedDeliverPrice] = useState<number>(0);
    const [openAlert, setOpenAlert] = useState({
        show: false,
        status: '',
        message: ''
    });


    const handleClose = () => {
        setOpenDialog(false);
    }

    const addVoucher = (voucher: VoucherModel) => {
        const index = vouchersApply.findIndex((v) => v.id === voucher.id);
        if (index === -1) {
            if (voucher.minAmount <= totalMoney) {
                if (voucher.voucherType === VoucherType.FOR_DELIVERY) {
                    const filter = vouchersApply.filter(v => v.voucherType === VoucherType.FOR_PRODUCT);
                    filter.push(voucher);
                    setVouchersApply(filter);
                } else {
                    const filter = vouchersApply.filter(v => v.voucherType === VoucherType.FOR_DELIVERY);
                    filter.push(voucher);
                    setVouchersApply(filter);
                }
            } else {
                setOpenAlert({
                    show: true,
                    status: 'error',
                    message: 'Đơn hàng không đủ điều kiện áp dụng voucher'
                })
            }
        }
    }

    const handleOpen = async () => {
        setOpenDialog(true);
    }

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

    useEffect(() => {
        for (let i = 0; i < vouchersApply.length; i++) {
            let priceDown = vouchersApply[i].discount * totalMoney;
            if (priceDown > vouchersApply[i].maxPrice) {
                priceDown = vouchersApply[i].maxPrice;
            }
            if (vouchersApply[i].voucherType === VoucherType.FOR_DELIVERY) {
                setDiscountedDeliverPrice(priceDown);
            } else {
                setDiscountedPrice(priceDown);
            }
        }
    }, [vouchersApply]);

    const changeDeliveryMethod = (e: SelectChangeEvent<DeliveryMethod>) => {
        setDeliverPrice(e.target.value === DeliveryMethod.ECONOMY ? 15000 : 30000);
    }

    const removeVoucher = (voucher: VoucherModel) => {
        setVouchersApply(vouchers => {
            const filter = vouchers.filter(v => v.id !== voucher.id);
            return filter;
        });
        if (voucher.voucherType === VoucherType.FOR_DELIVERY) {
            setDiscountedDeliverPrice(0);
        } else {
            setDiscountedPrice(0);
        }
    }

    useEffect(() => {
        document.title = "Thanh toán";
    }, []);


    const formikPayment = useFormik({
        initialValues: {
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || '',
            buyerName: user?.name || '',
            address: {
                street: user?.address?.street || '',
                district: user?.address?.district || '',
                city: user?.address?.city || ''
            },
            note: '',
            paymentMethod: PaymentMethod.COD,
            deliveryMethod: DeliveryMethod.ECONOMY,
            productOrders: cart.map((item) => ({
                productDetailId: item.productDetail.id || 0,
                quantity: item.quantity,
            })),
            vouchers: vouchersApply.map((voucher) => voucher.id)
        },
        validationSchema: validationOrderSchema,
        onSubmit: async (values: OrderDto) => {
            values.vouchers = vouchersApply.map((voucher) => voucher.id);
            try {
                const response: ResponseSuccess<OrderModel> = await createOrder(values);
                const order: OrderModel = response.data;
                setOpenAlert({
                    show: true,
                    status: 'success',
                    message: 'Đặt hàng thành công!'
                })
                localStorage.removeItem("cart");
                if (order.paymentMethod === PaymentMethod.CC) {
                    const paymentUrl: string = (await getVnpPaymentUrl(order.id, order.discountedAmount)).data;
                    location.href = paymentUrl;
                } else {
                    setTimeout(() => {
                        window.location.href = '/orders/' + order.id;
                    }, 500);
                }
            } catch (error) {
                setOpenAlert({
                    show: true,
                    status: 'error',
                    message: 'Đặt hàng không thành công!'
                })
            }
        },
    });
    const getAmountPayment = () => {
        let deliveryAmount = deliveryPrice - discountedDeliverPrice;
        if (deliveryAmount < 0) {
            deliveryAmount = 0;
        }
        return (totalMoney + deliveryAmount) - discountedPrice;
    }

    const colseAlert = () => {
        setOpenAlert(
            {
                show: false,
                status: '',
                message: ''
            }
        )
    }

    return (
        <Container sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#121212', // Nền tối cho chế độ tối
            color: '#ffffff', // Màu chữ sáng
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        }}>
            {openAlert.show && <AlertCustom alert={openAlert} colseAlert={colseAlert} />}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}><Typography variant="h4">Thanh toán</Typography></Box>
            <Box sx={{
                mt: 2,
                mb: 2
            }}>
                <Typography>Sản phẩm</Typography>
                {cart.map(c => <CartItem key={c.productDetail.id} item={c} hiddenButton={true} />)}
            </Box>
            <Box sx={{ mt: 2, mb: 1 }}><Typography>Thông tin người nhận</Typography></Box>
            <Box sx={{
                p: 2,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <TextField
                    sx={{
                        flexBasis: '200px',
                        display: 'flex',
                        flexGrow: 1
                    }}
                    label="Tên người nhận"
                    name="buyerName"
                    value={formikPayment.values.buyerName}
                    onChange={formikPayment.handleChange}
                    onBlur={formikPayment.handleBlur}
                    error={formikPayment.touched.buyerName && Boolean(formikPayment.errors.buyerName)}
                    helperText={formikPayment.touched.buyerName ? formikPayment.errors.buyerName : ""}
                />
                <TextField
                    sx={{
                        flexBasis: '200px',
                        display: 'flex',
                        flexGrow: 1
                    }}
                    label="Số điện thoại người nhận"
                    name="phoneNumber"
                    value={formikPayment.values.phoneNumber}
                    onChange={formikPayment.handleChange}
                    onBlur={formikPayment.handleBlur}
                    error={formikPayment.touched.phoneNumber && Boolean(formikPayment.errors.phoneNumber)}
                    helperText={formikPayment.touched.phoneNumber ? formikPayment.errors.phoneNumber : ""}
                />
            </Box>
            <Box sx={{
                p: 2,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <TextField
                    sx={{
                        flexBasis: '200px',
                        display: 'flex',
                        flexGrow: 1
                    }}
                    label="Tên đường"
                    name="address.street"
                    value={formikPayment.values.address.street}
                    onChange={formikPayment.handleChange}
                    onBlur={formikPayment.handleBlur}
                />
            </Box>

            <Box sx={{
                p: 2,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <TextField
                    sx={{
                        flexBasis: '200px',
                        display: 'flex',
                        flexGrow: 1
                    }}
                    label="Quận, huyện"
                    name="address.district"
                    value={formikPayment.values.address.district}
                    onChange={formikPayment.handleChange}
                    onBlur={formikPayment.handleBlur}
                />
                <TextField
                    sx={{
                        flexBasis: '200px',
                        display: 'flex',
                        flexGrow: 1
                    }}
                    label="Tỉnh, thành phố"
                    name="address.city"
                    value={formikPayment.values.address.city}
                    onChange={formikPayment.handleChange}
                    onBlur={formikPayment.handleBlur}
                />
            </Box>

            <Box sx={{
                p: 2,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <FormControl sx={{
                    flexBasis: '200px',
                    display: 'flex',
                    flexGrow: 1
                }}>
                    <InputLabel id="paymentMethod" sx={{ color: '#b0b0b0' }}>Phương thức thanh toán</InputLabel>
                    <Select
                        labelId="paymentMethod"
                        label="Phương thức thanh toán"
                        name="paymentMethod"
                        value={formikPayment.values.paymentMethod}
                        onChange={formikPayment.handleChange}
                        onBlur={formikPayment.handleBlur}
                        error={formikPayment.touched.paymentMethod && Boolean(formikPayment.errors.paymentMethod)}
                        sx={{
                            '& .MuiSelect-select': {
                                backgroundColor: '#1e1e1e',
                                color: '#ffffff',
                            },
                            '& .MuiFormLabel-root': {
                                color: '#b0b0b0',
                            },
                        }}
                    >
                        <MenuItem value={PaymentMethod.COD}>Thanh toán khi nhận hàng</MenuItem>
                        <MenuItem value={PaymentMethod.CC}>Thanh toán bằng ví điện tử</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{
                    flexBasis: '200px',
                    display: 'flex',
                    flexGrow: 1
                }}>
                    <InputLabel id="deliveryMethod" sx={{ color: '#b0b0b0' }}>Phương thức vận chuyển</InputLabel>
                    <Select
                        labelId="deliveryMethod"
                        label="Phương thức vận chuyển"
                        name="deliveryMethod"
                        value={formikPayment.values.deliveryMethod}
                        onChange={(e) => { formikPayment.handleChange(e); changeDeliveryMethod(e); }}
                        onBlur={formikPayment.handleBlur}
                        error={formikPayment.touched.deliveryMethod && Boolean(formikPayment.errors.deliveryMethod)}
                        sx={{
                            '& .MuiSelect-select': {
                                backgroundColor: '#1e1e1e',
                                color: '#ffffff',
                            },
                            '& .MuiFormLabel-root': {
                                color: '#b0b0b0',
                            },
                        }}
                    >
                        <MenuItem value={DeliveryMethod.EXPRESS}>Giao hàng nhanh</MenuItem>
                        <MenuItem value={DeliveryMethod.ECONOMY}>Giao hàng tiết kiệm</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{
                mt: 2,
                mb: 2
            }}>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleOpen}
                    sx={{
                        mt: 2,
                        backgroundColor: '#1e1e1e',
                        color: '#ffffff',
                        ':hover': { backgroundColor: '#333333' }
                    }}
                >
                    Chọn mã giảm giá
                </Button>
            </Box>
            {vouchersApply.length > 0 && vouchersApply.map(voucher => <Box sx={{ display: 'flex' }} key={voucher.id}>
                <VoucherView voucher={voucher} removeVoucher={removeVoucher} />
            </Box>)}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                <Typography>Tổng tiền: {convertPrice(totalMoney)} </Typography>
                <Typography>Phí vận chuyển: {deliveryPrice - discountedDeliverPrice > 0 ? convertPrice(deliveryPrice - discountedDeliverPrice) : convertPrice(0)} </Typography>
                <Typography>Giảm giá: {convertPrice(discountedPrice)} </Typography>
                <Typography>Số tiền phải thanh toán: {convertPrice(getAmountPayment())} </Typography>
            </Box>
            <Button
                onClick={() => formikPayment.submitForm()}
                sx={{
                    mt: 2,
                    mb: 4,
                    backgroundColor: '#1e1e1e',
                    color: '#ffffff',
                    ':hover': { backgroundColor: '#333333' }
                }}
                color="success"
                variant="outlined"
            >
                Đặt hàng
            </Button>
            {openDialog && <VoucherDialog addVoucher={addVoucher} handleClose={handleClose} openDialog={openDialog} vouchersApply={vouchersApply} />}
        </Container>
    );
}

export default Payment;
