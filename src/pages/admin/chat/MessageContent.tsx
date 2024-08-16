import { Box, Typography } from "@mui/material";
import { RoomModel } from "../../../models/room.model";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import ChatContent from "../../user/chat/ChatContent";

const MessageContent = () => {
    const room : RoomModel | null = useSelector((state: RootState) => state.rooms.currentState);
    return (
        <Box sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
        }}>
            {/* Header */}
            <Box sx={{
                backgroundColor: '#1e1e1e', 
                padding: '16px', 
                borderBottom: '1px solid #333', 
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between', 
            }}>
                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                    {room ? room.receiver : "No Room Selected"}
                </Typography>
                {/* Bạn có thể thêm các phần tử khác vào đây, chẳng hạn như nút hoặc biểu tượng */}
            </Box>
            <ChatContent height={490}/>
        </Box>
    );
}

export default MessageContent;
