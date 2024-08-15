import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Rating, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ProductModel } from "../../../models/product.model";
import { VisuallyHiddenInput } from "../../admin/products/CreateProduct";
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { CommentDto } from "../../../dtos/requests/comment.dto";
import { UserModel } from "../../../models/user.model";
import { getUserFromLocalStorage } from "../../../services/user.service";
import { sendCommentApi } from "../../../services/comment.service";

type Props = {
    openDialog: boolean,
    handleClose: () => void,
    product: ProductModel | undefined,
    setOpenAlert: React.Dispatch<React.SetStateAction<{
        show: boolean;
        status: string;
        message: string;
    }>>
}

const DialogRatingChild = ({ openDialog, handleClose, product, setOpenAlert }: Props) => {

    const user: UserModel | null = getUserFromLocalStorage();
    const [value, setValue] = useState<number | null>(0);
    const [images, setIamges] = useState<File[]>([]);
    const [urls, setUrls] = useState<string[]>([]);
    const [urlVideos, setUrlsVideos] = useState<string[]>([]);
    const [content, setContent] = useState<string>("");
    const [errRating, setErrRating] = useState<string>("");
    const [errContent, setErrContent] = useState<string>("");
    

    useEffect(() => {
        return () => {
            urls.forEach(url => {
                URL.revokeObjectURL(url);
            });
        }
    }, [urls]);

   

    const handleChangeImages = (e: React.ChangeEvent<HTMLInputElement>, isVideo: boolean = false) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setIamges([...images, ...Array.from(files)]);
            const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
            if(isVideo) {
                setUrlsVideos(prev => [...prev, ...imageUrls]);
            } else {
                setUrls(prev => [...prev, ...imageUrls]);
            }
        }
    }

    // const removeImage = (index: number) => {
    //     URL.revokeObjectURL(urls[index]);
    //     setUrls(prev => {
    //         const newUrls = prev.filter(url => url !== prev[index]);
    //         return newUrls;
    //     });
    //     setIamges(prev => {
    //         const newImages = prev.filter(img => img !== prev[index]);
    //         return newImages;
    //     });
    // }

    const sendComment = async () => {
        if(!value || value <= 0) {
            setErrRating("Vui lòng đánh giá trước khi gửi bình luận.");
            return;
        }
        if(content === "") {
            setErrContent("Vui lòng nhập nội dung bình luận.");
            return;
        }
        const commentDto: CommentDto = {
            content: content,
            productId: product?.id || -1,
            rating: value,
            media: images,
            email: user?.email || ""
        }
        try {
            await sendCommentApi(commentDto);
            setOpenAlert({
                show: true,
                status:'success',
                message: 'Gửi bình luận thành công'
            });
            handleClose();
        } catch (error) {
            console.log(error);
            setOpenAlert({
                show: true,
                status:'error',
                message: 'Đã xảy ra lỗi'
            });
            handleClose();
        }
    }

    return (
        <>
       
        <Dialog
            open={openDialog}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{ '& .MuiPaper-root': { backgroundColor: '#1e1e1e', color: '#ffffff' } }}
        >
            <DialogTitle>{"Bạn cảm thấy sản phẩm thế nào?"}</DialogTitle>
            <DialogContent sx={{
                overflow: 'auto', display: "flex",
                flexDirection: "column",
                gap: '16px'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '16px',
                    marginTop: '16px',
                    flexDirection: 'column',
                }}>
                    <Rating
                        size="large"
                        name="simple-controlled"
                        value={value}
                        onChange={(_, newValue) => {
                            setValue(newValue);
                            setErrRating("");
                        }}
                    />
                    {errRating && <Typography color="error" sx={{fontSize: '12px'}}>{errRating}</Typography>}
                </Box>
                <Box>
                    <Box sx={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                    }}>
                        <Button
                            component="label"
                            role={undefined}
                            variant="outlined"
                            tabIndex={-1}
                            startIcon={<ImageIcon />}
                        >
                            Ảnh
                            <VisuallyHiddenInput type="file" accept={"image/*"} multiple onChange={handleChangeImages} />
                        </Button>
                        <Button
                            component="label"
                            role={undefined}
                            variant="outlined"
                            tabIndex={-1}
                            startIcon={<VideoLibraryIcon />}
                        >
                            Video
                            <VisuallyHiddenInput type="file" accept="video/*" multiple onChange={(e) => handleChangeImages(e, true)} />
                        </Button>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                        mt: 2
                    }}>
                        {urls.map((url, index) => <img key={index} src={url} alt="image" width={130} height={130} />)}
                        {urlVideos.map((url, index) => <video key={index} src={url} width={130} height={130} controls/>)}
                    </Box>
                </Box>
                <TextField multiline rows={4} placeholder="Đánh giá của bạn"
                    value={content}
                    onChange={e => {setContent(e.target.value); setErrContent("")}}
                    error={errContent ? true : false}
                    helperText={errContent}
                ></TextField>
                <Box>
                    <Button variant="outlined" color="error" onClick={sendComment}>Gửi đánh giá</Button>
                </Box>


            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} sx={{ color: '#ffffff' }}>Đóng</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}

export default DialogRatingChild;