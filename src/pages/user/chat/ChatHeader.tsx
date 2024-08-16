import { Box, IconButton, Typography } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

type Props = {
    close: () => void,
}

const ChatHeader = ({close} : Props) => {
    return <Box sx={{
        display: 'flex',
        height: '8%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f2f2f2',
        pb: 1
    }}>
        <Typography>Nhắn tin với shop</Typography>
        <IconButton color="primary" size="small" onClick={close}><ClearIcon/></IconButton>
    </Box> 
}

export default ChatHeader;