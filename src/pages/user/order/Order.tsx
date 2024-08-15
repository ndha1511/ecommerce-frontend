import { Box, Container, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from "@mui/material";
import { OrderModel } from "../../../models/order.model";
import { convertPrice } from "../../../utils/convert-price";
import { useEffect, useState } from "react";
import { getUserFromLocalStorage } from "../../../services/user.service";
import { UserModel } from "../../../models/user.model";
import { ResponseSuccess } from "../../../dtos/responses/response.success";
import { PageResponse } from "../../../dtos/responses/page-response";
import { getPageOrders } from "../../../services/order.service";
import { getOrderStatusText } from "./OrderDetail";

const Order = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const user: UserModel | null = getUserFromLocalStorage();
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [pageNoState, setPageNoState] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);

    useEffect(() => {
        document.title = "Đơn hàng của tôi";
    }, []);


    useEffect(() => {
        (async () => {
            try {
                const response: ResponseSuccess<PageResponse<OrderModel[]>> = await getPageOrders(pageNoState, 10, [{
                    field: 'user.email',
                    value: user?.email || "",
                    operator: '-'
                }], [{
                    field: 'orderDate',
                    order: 'desc'
                }]);
                setOrders(response.data.data);
                setTotalPage(response.data.totalPage);
            } catch (error) {
                console.log(error);
            }

        })();
    }, [pageNoState])

   

    const handleNextPage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageNoState(value);
    }

    return <Container sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
    }}>
        {orders.length > 0 ?
            <Box sx={{
                pt:2,
                pb: 2
            }}>
                <Typography sx={{pb: 2}}>Đơn hàng</Typography>
                <TableContainer component={Paper}>
                    <Table size={isMobile ? 'small' : 'medium'} aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                {!isMobile && <TableCell>Mã đơn hàng</TableCell>}
                                <TableCell>Ngày đặt</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Tổng tiền</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order: OrderModel) => (
                                <TableRow key={order.id} sx={{
                                    ':hover': {
                                        backgroundColor: 'secondary.main',
                                        cursor: 'pointer'
                                    }
                                }} onClick={() => window.location.href = '/orders/' + order.id}>
                                    {!isMobile && <TableCell >{order.id}</TableCell>}
                                    <TableCell >{order.orderDate.toString()}</TableCell>
                                    <TableCell >

                                        {getOrderStatusText(order.orderStatus)}

                                    </TableCell>
                                    <TableCell >{convertPrice(order.discountedAmount)}</TableCell>


                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{
                    display: 'flex', alignItems: 'center',
                    width: '100%', justifyContent: 'flex-end',
                    mt: 2
                }}>
                    <Stack spacing={2}>
                        <Pagination shape="rounded"  count={totalPage} page={pageNoState} variant="outlined"  onChange={handleNextPage} />
                    </Stack>
                </Box>
            </Box> : <Typography component={"h3"}>Bạn chưa có đơn hàng nào</Typography>}
    </Container>
}

export default Order;