import { useEffect, useState } from "react";
import { ProductUserResponse } from "../../../dtos/responses/product-user-response";
import {  getPromontionProducts } from "../../../services/product.service";
import { Pagination } from "@mui/material";
import { Box, Container } from "@mui/system";
import { useLocation, useNavigate } from "react-router-dom";
import ListProduct from "./ListProduct";
import FilterProduct from "./FilterProduct";

const Promotion = () => {
     const [products, setProducts] = useState<ProductUserResponse[]>([]);
     const location = useLocation();
     const queryParams = new URLSearchParams(location.search);
     const [totalPage, setTotalPage] = useState(1);
     const pageNo = queryParams.get("pageNo") ? Number(queryParams.get("pageNo")) : 1;
     const [pageNoState, setPageNoState] = useState(pageNo);
     const [search, setSearch] = useState<{
          field: string,
          value: string,
          operator: string
      }[]>([]);
      const [sort, setSort] = useState<{
          field: string,
          order: string
      }[]>([]);
     const navigate = useNavigate();

     useEffect(() => {
          document.title = "Sản phẩm khuyến mãi";
      }, []);

     useEffect(() => {
          const fetchData = async () => {
               window.scrollTo({ top: 0, behavior: 'smooth' });
               const response = await getPromontionProducts(pageNoState, 40, search, sort);
               if (response.status === 200) {
                    setProducts(response.data.data);
                    setTotalPage(response.data.totalPage);
               }
          };
          fetchData();
     }, [pageNoState, search, sort]);
     const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
          setPageNoState(value);
          navigate('?pageNo=' + value);
          window.scrollTo({ top: 0, behavior: 'smooth' });
     };
     return (
          <Box sx={{ width: '100%' }}>
               <Container>
                    <FilterProduct pageNoState={pageNoState} search={search} setPageNoState={setPageNoState} setSearch={setSearch} setSort={setSort}/>
                    <ListProduct products={products} title="Sản phẩm khuyến mãi"/>
               </Container>
               {totalPage > 1 && <Box sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
               }}>
                    <Pagination
                         sx={{
                              mt: 3,
                              mb: 3
                         }}
                         count={totalPage} page={pageNo} variant="outlined" shape="rounded"
                         onChange={handleChange}
                    /></Box>}

          </Box>
     )
}

export default Promotion;