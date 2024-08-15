import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { OrderDetailModel } from "../../../models/order-detail.model";
import ProductDialogView from "./ProductDialogView";


type Props = {
    openDialog: boolean,
    handleClose: () => void,
    orderDetails: OrderDetailModel[]
}

const DialogRating = ({openDialog, handleClose, orderDetails} : Props) => {
    
    return (
        <Dialog
                open={openDialog}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                sx={{ '& .MuiPaper-root': { color: '#ffffff' } }}
            >
                <DialogTitle>{"Sản phẩm bạn đã mua trong đơn hàng"}</DialogTitle>
                <DialogContent sx={{ height: '400px', overflow: 'auto' }}>
                    {orderDetails.map(od => <ProductDialogView key={od.productDetail.id} product={od.productDetail.product}/>)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: '#ffffff' }}>Đóng</Button>
                </DialogActions>
            </Dialog>
    )
}

export default DialogRating;