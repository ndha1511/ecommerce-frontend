import { Box, IconButton, Typography } from "@mui/material";
import { VoucherModel, VoucherType } from "../../../models/voucher.model";
import { convertPrice } from "../../../utils/convert-price";
import voucherImage from "../../../assets/logo/voucher.png";
import voucherDelivery from "../../../assets/logo/voucherdelivery.png";
import ClearIcon from '@mui/icons-material/Clear';
import { useState } from "react";

type Props = {
    voucher: VoucherModel;
    removeVoucher: (voucher: VoucherModel) => void;
}

const VoucherView = ({voucher, removeVoucher} : Props) => {
    const [isHover, setIsHover] = useState<boolean>(false);
    return (
        <Box onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
         sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#2e2e2e',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
            marginBottom: '16px',
            color: '#ffffff',
            position: 'relative',
        }}>
            {isHover && <IconButton onClick={() => removeVoucher(voucher)} sx={{
                width: '30px',
                height: '30px',
                position: "absolute",
                top: 4,
                right: 0,
                zIndex: 2,
                mr: 2,
                color: "#fff",
                background: "rgba(0,0,0,0.5)",
                transition: "background-color 1.5s ease-in-out",
                "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.8)",
                }
            }}><ClearIcon/></IconButton>}
            <img src={voucher.voucherType === VoucherType.FOR_DELIVERY ? voucherDelivery : voucherImage} alt="Voucher" style={{ width: '50px', height: '50px', borderRadius: '8px' }} />
            <Box sx={{ flex: 1 }}>
                <Typography sx={{ marginBottom: '4px' }}>
                    {`Giảm ${voucher.discount * 100}% cho đơn hàng từ ${convertPrice(voucher.minAmount)}`}
                </Typography>
                <Typography variant="body2" sx={{ color: '#aaaaaa', marginBottom: '4px' }}>
                    {`Tối đa ${convertPrice(voucher.maxPrice)}`}
                </Typography>
                <Typography variant="body2" sx={{ color: '#aaaaaa' }}>
                    {`Hạn sử dụng: ${voucher.expiredDate}`}
                </Typography>
            </Box>
        </Box>
    )
}

export default VoucherView;
