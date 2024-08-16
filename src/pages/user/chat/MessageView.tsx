import { Box } from "@mui/material";
import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";

type Props = {
    visible: boolean;
    close: () => void;
}

const MessageView = ({visible, close} : Props) => {
    return (
        <Box
            onClick={e => e.stopPropagation()}
            sx={{
                position: 'absolute',
                width: '340px',
                height: '480px',
                backgroundColor: '#2c2c2c',
                top: '-490px',
                left: '-290px',
                zIndex: 200,
                borderRadius: '15px',
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
                padding: '10px',
                opacity: 0,
                transform: 'scale(0.8)',
                animation: visible ? 'fadeIn 0.3s ease-out forwards' : 'fadeOut 0.3s ease-in forwards',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header */}
            <ChatHeader close={close}/>
            {/* Content */}
            <ChatContent/>
        </Box>
    )
}

export default MessageView;