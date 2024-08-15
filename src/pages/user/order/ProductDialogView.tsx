import { Box, Button, Typography } from "@mui/material";
import { ProductModel } from "../../../models/product.model";
import { useState } from "react";
import DialogRatingChild from "./DialogRatingChild";
import AlertCustom from "../../../components/common/AlertCustom";

type Props = {
    product: ProductModel | undefined;
}

const ProductDialogView = ({ product }: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [openAlert, setOpenAlert] = useState({
        show: false,
        status: '',
        message: ''
    });
    const colseAlert = () => {
        setOpenAlert({ show: false, status: '', message: '' });
    }

    const handleClose = () => {
        setOpen(false);
    }



    return (
        <Box
            sx={{
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                p: 2,
                borderRadius: 2,
                backgroundColor: '#1e1e1e',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                    backgroundColor: '#333',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                },
            }}
        >
            {openAlert.show && <AlertCustom alert={openAlert} colseAlert={colseAlert} />}
            <img
                src={product ? product.thumbnail : ""}
                width={50}
                height={50}
                style={{
                    borderRadius: '8px',
                    transition: 'transform 0.3s ease',
                }}
                alt={product ? product.productName : ""}
                onError={(e) => (e.currentTarget.src = 'placeholder_image_url')}
            />
            <Typography
                sx={{
                    maxWidth: '60%',
                    fontWeight: 'bold',
                    color: '#ffffff',  // Màu chữ trắng cho dark mode
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {product ? product.productName : ""}
            </Typography>
            <Button
                color="error"
                variant="outlined"
                onClick={() => setOpen(true)}
                sx={{
                    textTransform: 'none',
                    borderColor: '#ff5252',
                    color: '#ff5252',
                    '&:hover': {
                        backgroundColor: '#ff5252',
                        borderColor: '#ff1744',
                        color: '#ffffff',
                    },
                }}
            >
                Đánh giá
            </Button>
            {open && <DialogRatingChild openDialog={open} handleClose={handleClose} product={product} setOpenAlert={setOpenAlert}/>}
        </Box>
    );
}

export default ProductDialogView;
