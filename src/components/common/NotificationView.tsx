import { MenuItem, Typography } from "@mui/material";
import { NotificationModel } from "../../models/notification.model";

type Props = {
    notification: NotificationModel
}

const NotificationView = ({ notification }: Props) => {
    return (
        <MenuItem
            onClick={() => {
                if(notification.redirectTo) {
                    window.location.href = notification.redirectTo;
                }
            }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                p: 2,
                borderBottom: '1px solid #333',
                backgroundColor: '#1e1e1e',
                '&:hover': {
                    backgroundColor: '#333',
                },
                gap: 1,
            }}
        >
            <Typography
                sx={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#ffffff', // Màu trắng để dễ đọc trên nền tối
                }}
            >
                {notification.content}
            </Typography>
            <Typography
                sx={{
                    fontSize: '12px',
                    color: '#cccccc', // Màu xám sáng để hiển thị ngày tháng
                    marginTop: 'auto',
                }}
            >
                {new Date(notification.notificationDate).toLocaleString()}
            </Typography>
        </MenuItem>
    );
}

export default NotificationView;
