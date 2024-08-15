import { Avatar, Box, Rating, Typography } from "@mui/material";
import { CommentResponse } from "../../../dtos/responses/comment-response";
import { CommentMediaModel } from "../../../models/comment.model";
import { MediaType } from "../../../models/enums/media-type.enum";



const CommentView = ({ commentResponse }: { commentResponse: CommentResponse }) => {
    const getMedia = (media: CommentMediaModel) => {
        if (media.mediaType === MediaType.IMAGE) {
            return <img key={media.id} src={media.path} alt="Comment Image" width={150} height={150} />;
        }
        return <video key={media.id} src={media.path} width={150} height={150} controls></video>
    }
    return <Box>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Avatar alt={commentResponse.comment.user.name} src={commentResponse.comment.user.avatarUrl} />
                <Typography>{commentResponse.comment.user.name}</Typography>
            </Box>
            <Box>
                <Typography>{`${commentResponse.comment.commentDate}`}</Typography>
            </Box>
        </Box>
        <Rating name="read-only" value={commentResponse.comment.rating} readOnly />
        <Typography>{commentResponse.comment.textContent}</Typography>
        {commentResponse.commentMedia && commentResponse.commentMedia.map((media) =>
            getMedia(media)
        )}
    </Box>
}

export default CommentView;