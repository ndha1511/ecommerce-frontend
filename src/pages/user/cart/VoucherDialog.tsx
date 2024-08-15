import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from "@mui/material";
import Voucher from "./Voucher";
import { useEffect, useState } from "react";
import { VoucherModel, VoucherType } from "../../../models/voucher.model";
import { ResponseSuccess } from "../../../dtos/responses/response.success";
import { getVouchersByEmail } from "../../../services/voucher.service";
import { UserModel } from "../../../models/user.model";
import { getUserFromLocalStorage } from "../../../services/user.service";

type Props = {
    vouchersApply: VoucherModel[],
    addVoucher: (voucherModel: VoucherModel) => void,
    openDialog: boolean,
    handleClose: () => void,
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const VoucherDialog = ({ vouchersApply, addVoucher, openDialog, handleClose }: Props) => {
    const user: UserModel | null = getUserFromLocalStorage();
    const [vouchers, setVouchers] = useState<VoucherModel[]>([]);
    const [vouchersDelivery, setVouchersDelivery] = useState<VoucherModel[]>([]);
    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        (async () => {
            try {
                const response: ResponseSuccess<VoucherModel[]> = await getVouchersByEmail(user?.email);
                setVouchers(response.data.filter(v => v.voucherType === VoucherType.FOR_PRODUCT));
                setVouchersDelivery(response.data.filter(v => v.voucherType === VoucherType.FOR_DELIVERY));
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return (
        <>
            <Dialog
                open={openDialog}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                sx={{ '& .MuiPaper-root': { backgroundColor: '#1e1e1e', color: '#ffffff', minWidth: '400px' } }}
            >
                <DialogTitle>{"Mã giảm giá của bạn"}</DialogTitle>
                <DialogContent sx={{ height: '400px', overflow: 'auto' }}>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Vận chuyển" {...a11yProps(0)} />
                                    <Tab label="Sản phẩm" {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={value} index={0}>
                                {vouchersDelivery.map((voucher: VoucherModel) => (
                                    <Voucher key={voucher.id} voucher={voucher} addVoucher={addVoucher} voucherApply={vouchersApply} />
                                ))}
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                                {vouchers.map((voucher: VoucherModel) => (
                                    <Voucher key={voucher.id} voucher={voucher} addVoucher={addVoucher} voucherApply={vouchersApply} />
                                ))}
                            </CustomTabPanel>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: '#ffffff' }}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default VoucherDialog;
