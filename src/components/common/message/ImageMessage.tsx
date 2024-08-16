import { Box } from "@mui/material";
import { Props } from "./TextMessage";

const ImageMessage = ({ message }: Props) => {
    return <Box sx={{
        maxWidth: '75%',
        marginBottom: '10px',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    }}>
        <img src={message.path} alt="image" height={180} width={"100%"}/>
    </Box>

}

export default ImageMessage;