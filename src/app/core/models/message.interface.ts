export interface MessageInterface {
    imageName: string;
    userName: string;
    postedAt: number;
    lastReplyAt: number;
    content: string;
    reactions: string;
    numberOfReplies: number;
    fileUrl: string;
    fileType: string;
    fileName: string;
    senderId: string;
}