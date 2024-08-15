import { Box } from "@mui/material"
import { pink, red } from "@mui/material/colors"
import MessageIcon from '@mui/icons-material/Message';

const MessageBox = () => {
    return <Box
        sx={{
            position: 'fixed',
            bottom: 40,
            right: 40,
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '60px',
            height: '60px',
            boxShadow: '1px 1px grey',
            backgroundColor: pink[600],
            zIndex: 100,
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
                transform: 'scale(1.05)',
            },
            '&:active': {
                transform: 'scale(0.9)',
            },
        }}
    >
        <MessageIcon sx={{ color: 'white', fontSize: 32 }} />
        <Box
            sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '15px',
                height: '15px',
                backgroundColor: red[600],
                borderRadius: '50%',
                border: '2px solid white',
            }}
        />
    </Box>
}

export default MessageBox;