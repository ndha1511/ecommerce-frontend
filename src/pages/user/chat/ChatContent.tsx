import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import TextMessage from "../../../components/common/message/TextMessage";
import InfiniteScroll from "react-infinite-scroll-component";
import { MessageModel, MessageType } from "../../../models/message.model";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { UserModel } from "../../../models/user.model";
import { getUserFromLocalStorage } from "../../../services/user.service";
import { RoomModel } from "../../../models/room.model";
import { getMessageByRoomId, sendMessage } from "../../../services/message.service";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { MessageDto } from "../../../dtos/requests/message.dto";
import { addMessage, initMessage, setPageNo as setPageNoMessage, setTotalPage as setTotalPageMessage } from "../../../redux/reducers/message-reducer";
import { getRoomsByEmail } from "../../../services/room.service";
import { initRooms, setCurrentRoom, setPageNo, setTotalPage } from "../../../redux/reducers/room-reducer";
import ImageMessage from "../../../components/common/message/ImageMessage";
import VideoMessage from "../../../components/common/message/VideoMessage";

type Props = {
    height: number
}


const ChatContent = ({ height }: Props) => {

    const messages: MessageModel[] = useSelector((state: RootState) => state.messsage.items);
    const room: RoomModel | null = useSelector((state: RootState) => state.rooms.currentState);
    const pageNo: number = useSelector((state: RootState) => state.messsage.pageNo);
    const totalPage: number = useSelector((state: RootState) => state.messsage.totalPage);
    const user: UserModel | any = getUserFromLocalStorage();
    const [text, setText] = useState<string>("");
    const dispatch = useDispatch();

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            if (room) {
                await send(room.receiver, files[0]);
            } else {
                await send("admin@gmail.com", files[0]);
                const response = await getRoomsByEmail(user.email);
                dispatch(initRooms(response.data.data));
                dispatch(setPageNo(response.data.pageNo));
                dispatch(setTotalPage(response.data.totalPage));
                dispatch(setCurrentRoom(response.data.data[0]));
            }
        }
    };


    const fetchMoreData = () => {
        if (pageNo + 1 <= totalPage) {
            dispatch(setPageNoMessage(pageNo + 1));
        }
    }

    useEffect(() => {

        if (room) {
            getMessage(room.roomId, user.email);
        }

    }, [pageNo, room]);

    const getMessage = async (roomId: string, email: string) => {
        try {
            const response = await getMessageByRoomId(roomId, email, pageNo, 40);
            dispatch(initMessage(response.data.data));
            dispatch(setPageNoMessage(response.data.pageNo));
            dispatch(setTotalPageMessage(response.data.totalPage));
        } catch (error) {
            console.log(error);
        }
    }

    const sendTextMessage = async () => {
        if (text !== "") {
            if (room) {
                await send(room.receiver);
            } else {
                await send("admin@gmail.com");
                const response = await getRoomsByEmail(user.email);
                dispatch(initRooms(response.data.data));
                dispatch(setPageNo(response.data.pageNo));
                dispatch(setTotalPage(response.data.totalPage));
                dispatch(setCurrentRoom(response.data.data[0]));
            }
            setText("");

        }
    }

    const handleEnterText = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key.toUpperCase() === "ENTER" && !e.shiftKey) {
            sendTextMessage();
            setText("");
        }

    }

    const send = async (receiver: string, file?: File) => {
        const messageDto: MessageDto = {
            message: text,
            sender: user.email,
            receiver: receiver,
            file: file
        }
        try {
            const response = await sendMessage(messageDto);
            dispatch(addMessage(response.data));
        } catch (error) {
            console.log(error);
        }
    }

    const renderMessage = (message: MessageModel) => {
        switch (message.messageType) {
            case MessageType.TEXT:
                return <TextMessage message={message} />
            case MessageType.IMAGE:
                return <ImageMessage message={message} />
            default:
                return <VideoMessage message={message} />
        }
    }

    return (
        <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
        }}>
            {/* Messages */}
            <div
                id="scrollableDiv"
                style={{
                    height: height,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    transition: 'overflow 0.3s ease',
                }}
            >
                <InfiniteScroll
                    dataLength={messages.length}
                    next={fetchMoreData}
                    style={{ display: 'flex', flexDirection: 'column-reverse' }}
                    inverse={true}
                    hasMore={true}
                    loader={<></>}
                    scrollableTarget="scrollableDiv"
                >
                    {messages.map(msg => (
                        <Box key={msg.id} sx={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: msg.sender === user.email ? 'flex-end' : 'flex-start',
                        }}>
                            {renderMessage(msg)}
                        </Box>
                    ))}
                </InfiniteScroll>
            </div>

            {/* Actions */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: 'auto',
                gap: '10px',
                paddingTop: '10px',
            }}>
                <>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                    />
                    <IconButton color="primary" size="small" onClick={handleButtonClick}>
                        <PhotoCameraIcon />
                    </IconButton>
                </>
                <Box sx={{ flex: 1 }}>
                    <TextField
                        onKeyDown={e => handleEnterText(e)}
                        multiline
                        maxRows={1}
                        fullWidth
                        variant="outlined"
                        placeholder="Type a message"
                        sx={{
                            '& .MuiInputBase-root': {
                                padding: '8px 12px',
                                borderRadius: '10px',
                            },
                        }}
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                </Box>

                <IconButton color="primary" size="small" onClick={sendTextMessage}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
}

export default ChatContent;
