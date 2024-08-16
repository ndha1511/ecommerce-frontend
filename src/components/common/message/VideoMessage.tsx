import { Box } from "@mui/material";
import { Props } from "./TextMessage";

const VideoMessage = ({ message }: Props) => {
    return <Box sx={{
        maxWidth: '75%',
        marginBottom: '10px',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    }}>
        <video src={message.path} height={180} style={{
            minWidth: '150px'
        }} controls/>
    </Box>

}

export default VideoMessage;