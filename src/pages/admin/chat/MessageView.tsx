import { Box, Typography } from "@mui/material";
import { RoomModel } from "../../../models/room.model";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { useState } from "react";
import { primaryGradient } from "../../../theme";
import MessageContent from "./MessageContent";
import { setCurrentRoom } from "../../../redux/reducers/room-reducer";

export const MessageView = () => {
    const rooms: RoomModel[] = useSelector((state: RootState) => state.rooms.items);
    const room : RoomModel | null = useSelector((state: RootState) => state.rooms.currentState);
    const [activeRoomId, setActiveRoomId] = useState<string | null>(room?.roomId || null);
    const dispatch = useDispatch();

    const handleRoomClick = (room: RoomModel) => {
        setActiveRoomId(room.roomId); 
        dispatch(setCurrentRoom(room));
    };

    return (
        <Box sx={{
            display: 'flex',
            height: '100vh',
            backgroundColor: '#121212', 
        }}>
            {/* Rooms */}
            <Box sx={{
                width: '30%',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                p: '16px',
                backgroundColor: '#1e1e1e',
                borderRight: '1px solid #333',
                overflowY: 'auto'
            }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#ffffff', marginBottom: '16px' }}>
                    Hộp thoại
                </Typography>
                {rooms.map((room: RoomModel) => {
                    const isActive = room.roomId === activeRoomId;
                    return (
                        <Box 
                            key={room.roomId}
                            onClick={() => handleRoomClick(room)}
                            sx={{
                                p: '12px',
                                background: isActive ? primaryGradient : '#2c2c2c', 
                                borderRadius: '8px',
                                boxShadow: isActive ? '0px 4px 8px rgba(0, 0, 0, 0.6)' : '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: '#3a3a3a',
                                }
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#ffffff' }}>
                                {room.receiver}
                            </Typography>
                        </Box>
                    );
                    
                })}
                
            </Box>
            {/* Messages */}
            <MessageContent/>
        </Box>
    );
}

export default MessageView;
