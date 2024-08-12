import { Box, Button, Container } from "@mui/material";
import Carousel from "../../../components/user/carousels/Carousel";
import { useEffect, useState } from "react";
import { getPageProducts, getPromontionProducts } from "../../../services/product.service";
import { ProductUserResponse } from "../../../dtos/responses/product-user-response";
import ListProduct from "../products/ListProduct";
import { useNavigate } from "react-router-dom";


const Home = () => {
     const [productSales, setProductSales] = useState<ProductUserResponse[]>([]);
     const [bestSellingProducts, setBestSellingProducts] = useState<ProductUserResponse[]>([]);
    
     const [ratingProducts, setRatingProducts] = useState<ProductUserResponse[]>([]);
     const navigate = useNavigate();

     useEffect(() => {
          const fetchData = async () => {
               window.scrollTo({ top: 0, behavior: 'smooth' });
               const response1 = await getPageProducts(1, 20, [], [{
                    field: 'buyQuantity',
                    order: 'desc'
               }])
               if (response1.status === 200) {
                    setBestSellingProducts(response1.data.data);
               }
               const response2 = await getPageProducts(1, 20, [], [{
                    field: 'numberOfRating',
                    order: 'desc'
               }]);
               if (response2.status === 200) {
                    setRatingProducts(response2.data.data);
               }
               const response3 = await getPromontionProducts(1, 20);
               if (response3.status === 200) {
                    setProductSales(response3.data.data);
               }
          };
          fetchData();
     }, []);
     return (
          <Box sx={{ width: '100%' }}>
               <Carousel>
                    <Button variant="outlined" size="large" color="inherit" onClick={() => navigate('/promotions')}>MUA NGAY</Button>
               </Carousel>
               <Container sx={{
                    mt: 2,
                    display: 'flex',
                    gap: '20px',
                    flexDirection: 'column',
                    mb: 4
               }}>
                    <Box>
                         {productSales.length > 0 &&
                              <ListProduct products={productSales} title="Khuyến mãi hot" applyCss={true} />
                         }
                         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                              <Button variant="contained" color="inherit" onClick={() => navigate('/promotions')}>Xem thêm</Button>
                         </Box>
                    </Box>
                    <Box>
                         {bestSellingProducts.length > 0 &&
                              <ListProduct products={bestSellingProducts} title="Sản phẩm bán chạy" applyCss={true} />
                         }
                         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                              <Button variant="contained" color="inherit" onClick={() => navigate('/products')}>Xem thêm</Button>
                         </Box>
                    </Box>
                    <Box>
                         {ratingProducts.length > 0 &&
                              <ListProduct products={ratingProducts} title="Sản phẩm được nhiều người đánh giá" applyCss={true} />
                         }
                         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                              <Button variant="contained" color="inherit" onClick={() => navigate('/products')}>Xem thêm</Button>
                         </Box>
                    </Box>
               </Container>

          </Box>
     )
}

export default Home;