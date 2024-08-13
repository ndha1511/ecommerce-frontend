import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { pinkGradient } from "../../../theme";
import ButtonGradient from "../../../components/common/ButtonGradient";
import AddIcon from '@mui/icons-material/Add';
import { ProviderModel } from "../../../models/provider.model";
import { ResponseSuccess } from "../../../dtos/responses/response.success";
import { getAllProviders } from "../../../services/provider.service";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Status } from "../../../models/enums/status.enum";

const Provider = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [providers, setProviders] = useState<ProviderModel[]>([]);
    const [open, setOpen] = useState(false);
    // const handleClose = () => {
    //     setOpen(false);
    // }
    console.log(open);
    useEffect(() => {
        (async () => {
            try {
                const response: ResponseSuccess<ProviderModel[]> = await getAllProviders();
                setProviders(response.data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);
    return (
        <Box sx={{
            p: 2
        }}>
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end', mb: 2 }}>
                <Typography component="span" sx={{ flexGrow: 1 }}>Danh sách nhà cung cấp</Typography>
                <ButtonGradient size="small" sx={{
                    background: pinkGradient,
                    color: "#fff",
                    fontSize: 10
                }} onClick={() => setOpen(true)}>Thêm nhà cung cấp <AddIcon /> </ButtonGradient>
            </Box>
            <TableContainer component={Paper}>
                <Table size={isMobile ? 'small' : 'medium'} aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Tên nhà cung cấp</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            {!isMobile && <TableCell>Số điện thoại</TableCell>}
                            {!isMobile && (
                                 <TableCell>Email</TableCell>
                            )}
                            {!isMobile && (
                                <TableCell>Địa chỉ</TableCell>
                            )}
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {providers.map((provider: ProviderModel) => (
                            <TableRow key={provider.id} sx={{
                                ':hover': {
                                    backgroundColor: 'secondary.main'
                                }
                            }}>
                                <TableCell >{provider.id}</TableCell>
                                <TableCell >{provider.providerName}</TableCell>
                                <TableCell >
                                    {provider.status === Status.ACTIVE ?
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '5px'
                                        }}><FiberManualRecordIcon fontSize="small" color="success" />Hoạt động</Box> :
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center', gap: '5px'
                                        }}><FiberManualRecordIcon fontSize="small" color="error" />Ngưng hoạt động</Box>}
                                </TableCell>
                                {!isMobile && <TableCell >{provider.phoneNumber}</TableCell>}
                                {!isMobile && <TableCell >{provider.email}</TableCell>}
                                {!isMobile && <TableCell >{provider.address?.street + ', ' +  provider.address?.district + ', ' +  provider.address?.city}</TableCell>}
                                <TableCell align="center">
                                    <Button sx={{
                                        width: '70px',
                                        height: '20px',
                                        fontSize: '8px',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        ml: 1
                                    }} color={'success'} variant="contained" onClick={() => {
                                       
                                    }}>Cập nhật</Button>
                                    <Button sx={{
                                        width: '70px',
                                        height: '20px',
                                        fontSize: '8px',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        ml: 1
                                    }} className="btn-action-table" variant="contained" color="error" onClick={() => {
                                       
                                    }} >Xóa</Button>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Provider;