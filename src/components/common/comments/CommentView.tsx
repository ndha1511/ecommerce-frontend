import { Box, Rating, Typography } from "@mui/material";
import { CommentResponse } from "../../../dtos/responses/comment-response";
import { CommentMediaModel } from "../../../models/comment.model";
import { MediaType } from "../../../models/enums/media-type.enum";



const CommentView = ({ commentResponse }: { commentResponse: CommentResponse }) => {
    const getMedia = (media: CommentMediaModel) => {
        if(media.mediaType === MediaType.IMAGE) {
            return <img key={media.id} src={media.path} alt="Comment Image" width={200} height={200}/>;
        }
        return <video key={media.id} src={media.path} width={200} height={200} controls></video>
    }
    return <>
        <Box>
            <Typography>{commentResponse.comment.user.name}</Typography>
            <Typography>{`${commentResponse.comment.commentDate}`}</Typography>
        </Box>
        <Rating name="read-only" value={commentResponse.comment.rating} readOnly />
        <Typography>{commentResponse.comment.textContent}</Typography>
        {commentResponse.commentMedia && commentResponse.commentMedia.map((media) => 
            getMedia(media)
        )}
    </>
}

export default CommentView;