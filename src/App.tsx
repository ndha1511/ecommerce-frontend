import { ReactNode, useEffect, useState } from "react";
import { getUserFromLocalStorage } from "./services/user.service";
import { connect, isConnected, stompClient } from "./configurations/websocket.config";
import { UserModel } from "./models/user.model";
import { Message } from "stompjs";
import { NotificationModel } from "./models/notification.model";
import { useDispatch } from "react-redux";
import { addNotification, setNotification } from "./redux/reducers/notification-reducer";
import { ResponseSuccess } from "./dtos/responses/response.success";
import { getNotificationsByUserId } from "./services/notification.service";
import { PageResponse } from "./dtos/responses/page-response";
import { MessageResponse } from "./dtos/responses/message-response";


const App = ({ children }: { children: ReactNode }) => {
    const user: UserModel | null = getUserFromLocalStorage();
    const [connectSuccess, setConnectSuccess] = useState<boolean>(false);
    const dispatch = useDispatch();
    useEffect(() => {
        if (user !== null) {
            connect(onConnected, onError);
            getNotifications(user.id);

        } else {
            setConnectSuccess(true);
        }
    }, []);

    const getNotifications = async (userId: number) => {
        try {
            const response: ResponseSuccess<PageResponse<NotificationModel[]>> = await getNotificationsByUserId(userId);
            dispatch(setNotification(response.data.data));
        } catch (error) {

        }
    }

    const onMessageReceived = (message: Message) => {
        const messageResponse: MessageResponse<any> = JSON.parse(message.body);
        if(messageResponse.type === "notification") {
            dispatch(addNotification(messageResponse.data));
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