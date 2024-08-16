import { Box } from "@mui/material";
import { pink, red } from "@mui/material/colors";
import MessageIcon from '@mui/icons-material/Message';
import { useState } from "react";
import MessageView from "./MessageView";

const MessageBox = () => {
    const [visible, setVisible] = useState(false);

    const close = () => {
        setVisible(false);
    }

    return (
        <Box
            onClick={() => setVisible(prev => !prev)}
            sx={{
                position: 'fixed',
                bottom: 40,
                right: 40,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '55px',
                height: '55px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: pink[600],
                zIndex: 100,
                transition: visible ? 'none' : 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: visible ? 'none' : 'scale(1.05)',
                },
                '&:active': {
                    transform: visible ? 'none' : 'scale(0.9)',
                },
            }}
        >
            {visible && (
               <MessageView visible={visible} close={close}/>
            )}
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
    );
}

export default MessageBox;
