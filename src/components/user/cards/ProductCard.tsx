import { Box, Card, CardContent, CardMedia, Rating, Typography, useMediaQuery } from "@mui/material";
import { ProductUserResponse } from "../../../dtos/responses/product-user-response";
import { convertPrice } from "../../../utils/convert-price";
import { red } from "@mui/material/colors";

type Props = {
    product: ProductUserResponse
}

const ProductCard = ({ product }: Props) => {
    const isMobile: boolean = useMediaQuery('(max-width:600px)');
    return (
        <Card sx={{
            width: '100%', position: 'relative', cursor: 'pointer',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
            }
        }} onClick={() => window.location.href = '/products/' + product.product.id}>
            {product.discount && <Box sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'red',
                p: 1,
                borderRadius: '0px 0px 0px 5px'
            }}>
                <Typography sx={{
                    color: '#fff',
                    fontSize: isMobile ? '8px' : '18px'
                }}>Giảm giá {product.discount * 100}%</Typography>
            </Box>}
            <CardMedia
                component="img"
                height={isMobile ? "160" : "250"}
                width={'100%'}
                image={product?.product.thumbnail ?? ''}
                alt={product?.product.productName ?? ''}
            />
            <CardContent sx={{ mb: 0, pb: 0 }}>
                <Typography gutterBottom sx={{
                    fontSize: isMobile ? '10px' : '14px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {product?.product.productName ?? ''}
                </Typography>
                <Box sx={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center'
                }}>
                    <Typography color={product.discount ? "text.secondary" : ""} sx={{
                        textDecoration: product.discount ? 'line-through' : 'none',
                        fontSize: isMobile ? '8px' : '12px'
                    }}>
                        {convertPrice(product.product.price)}
                    </Typography>
                    {product.discountedPrice && <Typography sx={{
                        fontSize: isMobile ? '8px' : '12px',
                        color: red[400],
                        fontWeight: 'bold',
                    }}>
                        {convertPrice(product.product.price - product.discountedPrice)}
                    </Typography>}
                </Box>
                <Box sx={{
                    mt: 1,
                }}>
                    {product.product.avgRating ?
                        <Box sx={{
                            display: 'flex',
                            gap: '5px',
                            alignItems: 'center',
                        }}>
                            <Rating size="small" name="read-only" value={product.product.avgRating} precision={0.5} readOnly /> 
                            <Typography sx={{ color: 'grey', fontSize: isMobile ? '8px' : '12px' }}>{`(${product.product.numberOfRating})`}</Typography>
                        </Box>:
                        <Typography sx={{ color: 'grey', fontSize: isMobile ? '8px' : '12px' }}>Chưa có đánh giá</Typography>}
                    {product.product.buyQuantity ?
                        <Typography sx={{ color: 'grey', fontSize: isMobile ? '8px' : '12px' }}>{'Đã bán ' + product.product.buyQuantity}</Typography>
                        : <Typography sx={{ color: 'grey', fontSize: isMobile ? '8px' : '12px' }}>{'Đã bán 0'}</Typography>}
                </Box>
            </CardContent>
        </Card>
    )
}

export default ProductCard;
