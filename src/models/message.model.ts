export enum MessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
}

export type MessageModel = {
    id: string;
    sender: string;
    receiver: string;
    roomId: string;
    sendDate: Date;
    messageType: MessageType;
    path?: string;
    content?: string;
}