import { ReactNode, useEffect, useState } from "react";
import { getUserFromLocalStorage } from "./services/user.service";
import { connect, isConnected, stompClient } from "./configurations/websocket.config";
import { UserModel } from "./models/user.model";
import { Message } from "stompjs";
import { NotificationModel } from "./models/notification.model";
import { useDispatch} from "react-redux";
import { addNotification, setNotification } from "./redux/reducers/notification-reducer";
import { ResponseSuccess } from "./dtos/responses/response.success";
import { getNotificationsByUserId } from "./services/notification.service";
import { PageResponse } from "./dtos/responses/page-response";
import { MessageResponse } from "./dtos/responses/message-response";
import { RoomModel } from "./models/room.model";
import { getRoomsByEmail } from "./services/room.service";
import { initRooms, setCurrentRoom, setPageNo, setTotalPage } from "./redux/reducers/room-reducer";
import { addMessage } from "./redux/reducers/message-reducer";
import { MessageModel } from "./models/message.model";
import { store } from "./redux/store/store";


const App = ({ children }: { children: ReactNode }) => {
    const user: UserModel | null = getUserFromLocalStorage();
    const [connectSuccess, setConnectSuccess] = useState<boolean>(false);
    const dispatch = useDispatch();
    useEffect(() => {
        if (user !== null) {
            connect(onConnected, onError);
            getNotifications(user.id);
            getRooms(user.email);

        } else {
            setConnectSuccess(true);
        }
    }, []);

    const getNotifications = async (userId: number) => {
        try {
            const response: ResponseSuccess<PageResponse<NotificationModel[]>> = await getNotificationsByUserId(userId);
            dispatch(setNotification(response.data.data));
        } catch (error) {
            console.log(error);
        }
    }

    const getRooms = async (email: string) => {
        try {
            const response: ResponseSuccess<PageResponse<RoomModel[]>> = await getRoomsByEmail(email);
            dispatch(initRooms(response.data.data));
            dispatch(setPageNo(response.data.pageNo));
            dispatch(setTotalPage(response.data.totalPage));
            console.log(response.data.data);
            if(response.data.data.length > 0) {
                dispatch(setCurrentRoom(response.data.data[0]));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onMessageReceived = (message: Message) => {
        const messageResponse: MessageResponse<any> = JSON.parse(message.body);
        if(messageResponse.type === "notification") {
            dispatch(addNotification(messageResponse.data));
        } else {
            const message : MessageModel = messageResponse.data;
            const currentRoom = store.getState().rooms.currentState;
            if(currentRoom && message.roomId === currentRoom.roomId) {
                console.log(message);
                dispatch(addMessage(messageResponse.data));
            }
        }
    }

    const onNotificationReceived = (message: Message) => {
        const notificaiton: NotificationModel = JSON.parse(message.body);
        dispatch(addNotification(notificaiton));
    }

    const onConnected = () => {
        console.log("Connected to websocket server");
        if (isConnected() && stompClient) {
            stompClient.subscribe("/user/" + user?.email + "/queue/notifications", onMessageReceived);
            stompClient.subscribe(`/topic/notifications`, onNotificationReceived);
        }
        setConnectSuccess(true);
    }

    const onError = () => {
        console.log("Error connecting to websocket server");
    }
    return connectSuccess ? children : <></>;
}

export default App;