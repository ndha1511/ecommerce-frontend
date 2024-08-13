import { Box, Button, Container, Pagination, Rating, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { ProductResponse } from "../../../dtos/responses/product-response";
import { useParams } from "react-router-dom";
import { ResponseSuccess } from "../../../dtos/responses/response.success";
import { getPageProducts, getProductById } from "../../../services/product.service";
import { ProductImageModel } from "../../../models/product-image.model";
import { ProductModel } from "../../../models/product.model";
import { ProductDetailModel } from "../../../models/product-detail.model";
import { convertPrice } from "../../../utils/convert-price";
import { ColorModel } from "../../../models/color.model";
import { SizeModel } from "../../../models/size.model";
import DoneIcon from '@mui/icons-material/Done';
import { addToCartLocalStorage } from "../../../utils/cart-handle";
import { useDispatch } from "react-redux";
import { updateCartState } from "../../../redux/reducers/cart-reducer";
import QuantityProduct from "../../../components/user/quantity-product/QuantityProduct";
import ListImage from "../../../components/user/list-image/ListImage";
import { connect, isConnected, stompClient } from "../../../configurations/websocket.config";
import { Message } from "stompjs";
import { CommentResponse } from "../../../dtos/responses/comment-response";
import CommentView from "../../../components/common/comments/CommentView";
import { getPageCommentsByProductId } from "../../../services/comment.service";
import { PageResponse } from "../../../dtos/responses/page-response";
import { green, red } from "@mui/material/colors";
import { ProductUserResponse } from "../../../dtos/responses/product-user-response";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ListProduct from "./ListProduct";
import { theme } from "../../../theme";

type SizeColorProps = {
    text: string;
    changeActive: (index: number) => void;
    index: number;
    activeIndex: number;
    color?: string;
    sx?: object;
}

const SizeColorBox = ({ text, changeActive, index, activeIndex, color, sx }: SizeColorProps) => {
    return (
        <Box
            sx={{
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: color ? color : '#fff',
                textAlign: 'center',
                color: 'black',
                borderRadius: color ? '50%' : '10px',
                position: 'relative',
                cursor: 'pointer',
                border: '3px solid white',
                flexGrow: 1,
                maxWidth: '40px',
                minWidth: '40px',
                maxHeight: '40px',
                minHeight: '40px',
                '&:hover': {
                    opacity: 0.8,
                    transform: 'scale(1.05)',
                },
                ...sx,
            }}
            onClick={() => changeActive(index)}
        >
            <Typography>{color ? '' : text}</Typography>
            {index === activeIndex && <Box sx={{
                position: 'absolute',
                top: 0,
                right: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: green[400],
            }}>
                <DoneIcon fontSize="medium" />
            </Box>}
        </Box>
    )
}

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<ProductModel>();
    const [productUserResponse, setProductUserResponse] = useState<ProductUserResponse>();
    const [productsUserResponse, setProductsUserResponse] = useState<ProductUserResponse[]>([]);
    const dispatch = useDispatch();
    const [productImages, setProductImages] = useState<ProductImageModel[]>([]);
    const [productDetails, setProductDetails] = useState<ProductDetailModel[]>([]);
    const [colors, setColors] = useState<ColorModel[]>([]);
    const [sizes, setSizes] = useState<SizeModel[]>([]);
    const [activeSize, setActiveSize] = useState<number>(0);
    const [activeColor, setActiveColor] = useState<number>(0);
    const [quantityInStock, setQuantityInStock] = useState<number>(0);
    const [buyQuantity, setBuyQuantity] = useState<number>(1);
    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [pageNo, setPageNo] = useState<number>(1);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const changeActiveSize = (index: number) => {
        setActiveSize(index);
    }

    const changeActiveColor = (index: number) => {
        setActiveColor(index);
    }

    useEffect(() => {
        if (!isConnected()) {
            connect(onConnected, onError);
        }
        else if (stompClient) {
            stompClient.subscribe(`/topic/product/${id}`, onMessageReceived, { id: id });
        }
        return () => {
            if (isConnected() && stompClient) {
                stompClient.unsubscribe(`${id}`);
            }
        }
    }, [stompClient]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const response: ResponseSuccess<PageResponse<CommentResponse[]>> = await getPageCommentsByProductId(pageNo, 5, Number(id));
                setComments(response.data.data);
                setTotalPage(response.data.totalPage);
                setPageNo(response.data.pageNo);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [pageNo]);

    const onMessageReceived = (message: Message) => {
        const commentData: CommentResponse = JSON.parse(message.body);
        setComments(prev => [commentData, ...prev]);
    }

    const onConnected = () => {
        console.log("Connected to websocket server product detail");
        if (isConnected() && stompClient) {
            stompClient.subscribe(`/topic/product/${id}`, onMessageReceived, { id: id });
        }
    }

    const onError = () => {
        console.log("Error connecting to websocket server");
    }




    useEffect(() => {
        (async () => {
            try {
                const response: ResponseSuccess<ProductResponse> = await getProductById(Number(id));
                const response2: ResponseSuccess<PageResponse<ProductUserResponse[]>> = await getPageProducts(1, 1, [
                    {
                        field: 'id',
                        operator: '-',
                        value: id || '',
                    }
                ]);
                const response3: ResponseSuccess<PageResponse<ProductUserResponse[]>> = await getPageProducts(1, 20, [
                    {
                        field: 'category.categoryName',
                        operator: '-',
                        value: response.data.product.category?.categoryName || '',
                    }
                ]);
                setProductsUserResponse(response3.data.data);
                setProductUserResponse(response2.data.data[0]);
                setProduct(response.data.product);
                setProductImages(response.data.productImages ?? []);
                setProductDetails(response.data.productDetails ?? []);
                let uniqueColors: ColorModel[] = [];
                response.data
                    .productDetails?.forEach((productDetail: ProductDetailModel) => {
                        const filter: ColorModel[] = uniqueColors.filter(
                            (color: ColorModel) => color.id === productDetail.color.id
                        );
                        if (filter.length <= 0) {
                            uniqueColors.push(productDetail.color)
                        }
                    });
                setColors(uniqueColors);
                let uniqueSizes: SizeModel[] = [];
                response.data
                    .productDetails?.forEach((productDetail: ProductDetailModel) => {
                        const filter: SizeModel[] = uniqueSizes.filter(
                            (size: SizeModel) => size.id === productDetail.size.id
                        );
                        if (filter.length <= 0) {
                            uniqueSizes.push(productDetail.size)
                        }
                    });
                setSizes(uniqueSizes);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    useEffect(() => {
        const productDetailFilter = getProductDetailByColorIdAndSizeId();
        setQuantityInStock(productDetailFilter?.quantity ?? 0);
        setBuyQuantity(1);
    }, [activeColor, activeSize, productDetails]);


    const getProductDetailByColorIdAndSizeId = () => {
        const productDetailFilter = productDetails.filter((productDetail: ProductDetailModel) => {
            return productDetail.color.id === colors[activeColor].id && productDetail.size.id === sizes[activeSize].id;
        });
        if (productDetailFilter.length > 0) {
            return productDetailFilter[0];
        }
    }


    const addToCard = () => {
        const productDetail = getProductDetailByColorIdAndSizeId();
        if (productDetail) {
            addToCartLocalStorage({
                productDetail: productDetail,
                quantity: buyQuantity,
                discountedPrice: (product?.price || 0) - (productUserResponse?.discountedPrice || 0)
            });
            dispatch(updateCartState());
        }

    }

    const setBuyQuantityProp = (value: number) => {
        setBuyQuantity(value);
    }

    const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageNo(value);
   };

    return (
        <Container sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            pb: 2

        }}>
            <Box sx={{
                display: 'flex',
                gap: '50px',
                flexWrap: 'wrap'
            }}>
                <ListImage images={productImages} />

                {/* right */}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '20px', width: '45%' }}>
                    <Typography component={'p'} variant="h5" sx={{
                        maxWidth: '100%',
                        wordBreak: 'break-word'
                    }}>
                        {product?.productName}
                    </Typography>
                    <Typography>
                        Thương hiệu: {product?.provider?.providerName}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '25px' }}>
                        {productUserResponse?.discountedPrice && <>
                            <Typography sx={{
                                textDecoration: 'line-through'
                            }}>
                                {convertPrice(product?.price)}
                            </Typography>
                        </>}
                        <Typography sx={{
                            color: productUserResponse?.discountedPrice ? red[400] : '',
                            fontWeight: productUserResponse?.discountedPrice ? 'bold' : ''
                        }}>
                            {productUserResponse?.discountedPrice ? convertPrice((product?.price || 0) - productUserResponse?.discountedPrice) : convertPrice(product?.price)}
                        </Typography>
                    </Box>
                    {product?.avgRating ? <Box sx={{ display: 'flex', gap: '5px' }}>
                        <Rating name="read-only" value={product.avgRating} precision={0.5} readOnly />
                        <Typography sx={{ color: 'blue' }}>{product.numberOfRating + ' đánh giá'}</Typography>
                    </Box> :
                        <Typography>Chưa có đánh giá</Typography>}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}>
                        <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <Typography sx={{ flexGrow: 1, maxWidth: '20%' }}>
                                Màu sắc:
                            </Typography>
                            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                {colors.map((color: ColorModel, index: number) => (
                                    <SizeColorBox sx={{
                                        border: `3px solid ${index === activeColor ? '#4caf50' : 'white'}`,
                                    }} color={color.colorHex} key={color.id} text={color.colorName ?? ''} changeActive={changeActiveColor}
                                        index={index} activeIndex={activeColor} />
                                ))}
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: '12px' }}>
                            <Typography sx={{ flexGrow: 1, maxWidth: '20%' }}>
                                Kích thước:
                            </Typography>
                            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                {sizes.map((size: SizeModel, index: number) => (
                                    <SizeColorBox sx={{
                                        border: `3px solid ${index === activeSize ? '#4caf50' : 'white'}`,
                                    }} key={size.id} text={size.numberSize?.toString() ?? size.textSize ?? ''}
                                        changeActive={changeActiveSize} index={index} activeIndex={activeSize} />
                                ))}
                            </Box>
                        </Box>
                        <Box>
                            <Typography>
                                Số lượng trong kho: {quantityInStock?.toString()}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Typography>
                                Số lượng:
                            </Typography>
                            <QuantityProduct quantity={buyQuantity} setQuantity={setBuyQuantityProp} maxValue={quantityInStock} />
                        </Box>
                        <Box sx={{
                            mt: 2,
                            display: 'flex',
                            gap: '20px',
                            alignItems: 'center'
                        }}>
                            <Button variant="contained" color="inherit" onClick={addToCard} size="large">
                                <AddShoppingCartIcon />
                                Thêm vào giỏ hàng
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Typography variant="h6" sx={{ mt: 12 }}>Mô tả sản phẩm</Typography>
            <Box>
                {product?.description}
            </Box>
            <Typography variant="h6" sx={{ mt: 2 }}>Thông tin thương hiệu</Typography>
            <Box>
                Thương hiệu: {product?.provider?.providerName}
            </Box>
            <Box>
                Địa chỉ: {`${product?.provider?.address?.street}, ${product?.provider?.address?.district}, ${product?.provider?.address?.city}`}
            </Box>
            <Box>
                Email: {product?.provider?.email}
            </Box>
            <Box>
                Số điện thoại: {product?.provider?.phoneNumber}
            </Box>
            <Typography sx={{ mt: 2 }} variant="h6">Đánh giá</Typography>
            <Box sx={{ mt: 1, maxHeight: '1000px', overflow: 'auto' }}>
                {comments.map((comment) => {
                    return <Box sx={{ borderBottom: '1px solid grey', p: 3 }} key={comment.comment.id}><CommentView commentResponse={comment} /></Box>
                }
                )}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 2,
                    gap: '20px'
                }}>
                    <Pagination count={totalPage} page={pageNo} shape="rounded" onChange={handleChange}/>
                </Box>
            </Box>
            <Typography sx={{ mt: 2 }} variant="h6">Các sản phẩm tương tự</Typography>
            <Box>
                <ListProduct products={productsUserResponse} title="" />
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 2,
                    mb: 2,
                    gap: '20px'
                }}>
                    <Button size={isMobile ? "small" : "large"} variant="outlined" color="inherit"
                        onClick={() => window.location.href =`/products?pageNo=1&search=category.categoryName-${product?.category?.categoryName}`}
                    >Xem thêm</Button>
                </Box>
            </Box>
        </Container>
    )
}

export default ProductDetail;