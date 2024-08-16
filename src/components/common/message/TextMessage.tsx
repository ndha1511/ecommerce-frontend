import { Box } from "@mui/material";
import { pink } from "@mui/material/colors";
import { MessageModel } from "../../../models/message.model";
import { UserModel } from "../../../models/user.model";
import { getUserFromLocalStorage } from "../../../services/user.service";

export type Props = {
    message: MessageModel;

}

const TextMessage = ({ message }: Props) => {
    const user: UserModel | any = getUserFromLocalStorage();
    return (
        <Box
            sx={{
                maxWidth: '75%',
                padding: '10px 15px',
                borderRadius: '15px',
                marginBottom: '10px',
                backgroundColor: user.email === message.sender ? pink[600] : '#e0e0e0',
                color: user.email === message.sender ? '#ffffff' : '#000000',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                wordBreak: 'break-word',
            }}
        >
            {message.content}
        </Box>
    );
}

export default TextMessage;
