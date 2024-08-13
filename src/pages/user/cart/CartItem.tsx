import { Box, Button, Tooltip, Typography } from "@mui/material";
import { convertPrice } from "../../../utils/convert-price";
import { useNavigate } from "react-router-dom";
import { CartItemModel } from "../../../models/cart-item.model";
import QuantityProduct from "../../../components/user/quantity-product/QuantityProduct";
import { useState } from "react";
import { removeItemCart } from "../../../utils/cart-handle";
import { useDispatch } from "react-redux";
import { updateCartState } from "../../../redux/reducers/cart-reducer";
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
    item: CartItemModel,
    hiddenButton?: boolean
}

const CartItem = ({ item, hiddenButton }: Props) => {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState<number>(item.quantity);
    const dispatch = useDispatch();

    const setQuantityProp = (quantity: number) => {
        setQuantity(quantity);
    }

    const deleteItemCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        removeItemCart(item);
        dispatch(updateCartState());
    }

    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            mb: 2,
            backgroundColor: 'background.paper',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s ease',
            '&:hover': {
                backgroundColor: 'action.hover',
            },
            '@media (max-width: 600px)': {
                flexDirection: 'column',
                alignItems: 'flex-start',
            }
        }} onClick={() => navigate("/products/" + item.productDetail.product?.id)}>
            <Box sx={{
                flexShrink: 0,
                mb: { xs: 1, sm: 0 }, // margin-bottom nhỏ hơn trên màn hình nhỏ
                width: { xs: '100px', sm: '80px' } // Điều chỉnh kích thước ảnh trên màn hình nhỏ
            }}>
                <img src={item.productDetail.product?.thumbnail ?? ""} alt={item.productDetail.product?.productName ?? ""} width="100%" height="auto" style={{ objectFit: 'cover', borderRadius: '4px' }} />
            </Box>
            <Box sx={{
                flex: 2,
                mb: { xs: 1, sm: 0 }, // margin-bottom nhỏ hơn trên màn hình nhỏ
                width: { xs: '100%', sm: 'auto' }
            }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                    {item.productDetail.product?.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Màu sắc: {item.productDetail.color.colorName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Kích thước: {item.productDetail.size.numberSize ?? item.productDetail.size.textSize}
                </Typography>
            </Box>
            <Box sx={{
                flex: 1,
                mb: { xs: 1, sm: 0 },
                width: { xs: '100%', sm: 'auto' }
            }}>
                <Typography variant="body2" color="text.secondary">
                    Đơn giá: {item.discountedPrice ? convertPrice(item.discountedPrice) : convertPrice(item.productDetail.product?.price)}
                </Typography>
                {hiddenButton && <Typography variant="body2" color="text.secondary">
                    Số lượng: {item.quantity}
                    </Typography>}
            </Box>
            {!hiddenButton && <Box sx={{
                flex: 1,
                mb: { xs: 1, sm: 0 },
                width: { xs: '100%', sm: 'auto' }
            }}>
                <Typography variant="body2" color="text.secondary">
                    Còn {item.productDetail.quantity} sản phẩm
                </Typography>
                <QuantityProduct cartItem={item} quantity={quantity} setQuantity={setQuantityProp} maxValue={item.productDetail?.quantity ?? 0} />
            </Box>}
            <Box sx={{
                flex: 1,
                mb: { xs: 1, sm: 0 },
                width: { xs: '100%', sm: 'auto' }
            }}>
                <Typography variant="body2" color="text.secondary">
                    Số tiền: {item.discountedPrice ? convertPrice(item.discountedPrice * (item.quantity ?? 0)) : convertPrice((item.productDetail.product?.price ?? 0) * (item.quantity ?? 0))}
                </Typography>
            </Box>
            {!hiddenButton && <Box sx={{
                flexShrink: 0,
                width: { xs: '100%', sm: 'auto' },
                display: 'flex',
                justifyContent: { xs: 'center', sm: 'flex-start' } // Canh giữa nút xóa trên màn hình nhỏ
            }}>
                <Tooltip title="Xóa">
                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={(e) => deleteItemCart(e)}
                        sx={{
                            borderRadius: '4px',
                            color: 'error.main',
                            borderColor: 'error.main',
                            '&:hover': {
                                backgroundColor: 'error.light',
                                borderColor: 'error.dark',
                                color: 'error.contrastText',
                            },
                        }}
                    >
                        <DeleteIcon />
                    </Button>
                </Tooltip>
            </Box>}
        </Box>
    )
}

export default CartItem;
