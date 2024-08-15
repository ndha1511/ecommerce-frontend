import { useEffect, useState } from "react";
import { ResponseSuccess } from "../../../dtos/responses/response.success";
import { PageResponse } from "../../../dtos/responses/page-response";
import { OrderModel } from "../../../models/order.model";
import { getPageOrders, updateStatusOrder } from "../../../services/order.service";
import { Box, Button, FormControl, InputLabel, MenuItem, Pagination, Paper, Select, SelectChangeEvent, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from "@mui/material";
import { OrderStatus } from "../../../models/enums/order-status.enum";
import { convertPrice } from "../../../utils/convert-price";
import SearchInput from "../../../components/common/search-input/SearchInput";
import { DatePicker } from "@mui/x-date-pickers";
import AlertCustom from "../../../components/common/AlertCustom";
import { getOrderStatusText } from "../../user/order/OrderDetail";


const Order = () => {
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [pageNoState, setPageNoState] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const isMobile = useMediaQuery('(max-width:600px)');
    const [openAlert, setOpenAlert] = useState({
        show: false,
        status: '',
        message: ''
    });
    const [search, setSearch] = useState<{
        field: string,
        value: string,
        operator: string
    }[]>([]);
    const [status, setStatus] = useState<string>("ALL");
    const [sort, setSort] = useState<{
        field: string,
        order: string
    }[]>([]);
    const [sortView, setSortView] = useState<string>("ALL");
    const [reload, setReload] = useState<boolean>(false);


    useEffect(() => {
        (async () => {
            try {
                const response: ResponseSuccess<PageResponse<OrderModel[]>> = await getPageOrders(pageNoState, 10, search, sort);
                setOrders(response.data.data);
                setTotalPage(response.data.totalPage);
            } catch (error) {
                console.log(error);
            }

        })();
    }, [pageNoState, search, sort, reload])

    const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageNoState(value);
    }

    const colseAlert = () => {
        setOpenAlert({ show: false, status: '', message: '' });
    }

    const changeSelect = (event: SelectChangeEvent<string>, dispatch: React.Dispatch<React.SetStateAction<string>>, sort: boolean = false) => {
        dispatch(event.target.value);
        if (event.target.value !== "ALL") {
            if (!sort) {
                setSearch(prev => {
                    const filter = prev.filter(s => s.field !== event.target.name);
                    filter.push({
                        field: event.target.name,
                        value: event.target.value,
                        operator: "-"
                    })
                    return filter;
                });
                setPageNoState(1);
            } else {
                const arrSplit: string[] = event.target.value.split(":");
                setSort([
                    {
                        field: arrSplit[0],
                        order: arrSplit[1]
                    }
                ]);
                setPageNoState(1);
            }
        } else {
            if (!sort) {
                setSearch([]);
            } else {
                setSort([]);
            }
        }

    }


    const handleClick =  async (orderId: string) => {
        try {
            await updateStatusOrder(orderId, {
                status: OrderStatus.SHIPPED
            });
            setReload(prev => !prev);
            setOpenAlert({ show: true, status: 'success', message: 'cập nhật thành công' });
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearch = async (value: string) => {
        setSearch([
            {
                field: "user.email",
                value: value,
                operator: "-"
            }
        ])
    }

    return (<Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end', mb: 2 }}>
            <Typography component="span" sx={{ flexGrow: 1 }}>Danh sách hóa đơn</Typography>
        </Box>
        {/* Alert */}
        {openAlert.show && <AlertCustom alert={openAlert} colseAlert={colseAlert} />}
        {/* Filter */}
        <Box sx={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", mb: 3,
            flexWrap: "wrap",
            gap: '25px'
        }}>
            <Box sx={{
                display: 'flex',
                gap: '15px',
                flexWrap: "wrap",
                flexDirection: 'column',
            }}>
                <SearchInput placeHolder={"Tìm theo email"} handleSearch={handleSearch} />
                <Box sx={{
                    display: 'flex',
                    gap: '15px',
                    flexWrap: "wrap",
                }}>
                    <DatePicker label="Từ ngày" />
                    <DatePicker label="Đến ngày" />
                </Box>

            </Box>

            <Box sx={{
                display: 'flex',
                gap: '15px',
                flexWrap: "wrap",
            }}>
                <FormControl sx={{
                    minWidth: '120px'
                }}>
                    <InputLabel id="orderStatus">Trạng thái</InputLabel>
                    <Select labelId="orderStatus"
                        name="orderStatus"
                        label="Trạng thái" size={"small"} value={status} onChange={e => changeSelect(e, setStatus)}>
                        <MenuItem value="ALL">--.--</MenuItem>
                        <MenuItem value="PAID">Đã thanh toán</MenuItem>
                        <MenuItem value="UNPAID">Chưa thanh toán</MenuItem>
                        <MenuItem value="PENDING">Đang chờ xử lý</MenuItem>
                        <MenuItem value="PROCESSING">Đang vận chuyển</MenuItem>
                        <MenuItem value="SHIPPED">Đã giao hàng</MenuItem>
                        <MenuItem value="DELIVERED">Đã nhận hàng</MenuItem>
                        <MenuItem value="CANCELLED">Đã hủy</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{
                    minWidth: '120px'
                }}>
                    <InputLabel id="status">Sắp xếp</InputLabel>
                    <Select labelId="status"
                        label="Trạng thái" size={"small"} value={sortView} onChange={e => changeSelect(e, setSortView, true)} >
                        <MenuItem value="ALL">--.--</MenuItem>
                        <MenuItem value="orderDate:desc">Mới nhất</MenuItem>
                        <MenuItem value="orderDate:asc">Cũ nhất</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </Box>

        {/* Table orders */}
        <TableContainer component={Paper}>
            <Table size={isMobile ? 'small' : 'medium'} aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Mã đơn hàng</TableCell>
                        <TableCell>Ngày đặt</TableCell>
                        <TableCell>Người đặt</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Tổng tiền</TableCell>
                        <TableCell align="center">Thao tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order: OrderModel) => (
                        <TableRow key={order.id} sx={{
                            ':hover': {
                                backgroundColor: 'secondary.main'
                            }
                        }}>
                            <TableCell >{order.id}</TableCell>
                            <TableCell >{order.orderDate.toString()}</TableCell>
                            <TableCell >{order.user.name}</TableCell>
                            <TableCell >

                                {getOrderStatusText(order.orderStatus)}

                            </TableCell>
                            <TableCell >{convertPrice(order.discountedAmount)}</TableCell>

                            <TableCell align="center">
                                {(order.orderStatus === OrderStatus.PENDING || order.orderStatus === OrderStatus.PAID) &&
                                    <Button color="success" variant="contained" onClick={() => handleClick(order.id)}>Xác nhận</Button>
                                }
                            </TableCell>

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
                <Pagination count={totalPage} page={pageNoState} variant="outlined" color={"primary"} onChange={handleChange} />
            </Stack>
        </Box>
    </Box>)
}

export default Order;