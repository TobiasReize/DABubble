export interface MessageInterface {
    imageName: string;
    userName: string;
    postedAt: number;
    lastReplyAt: number;
    content: string;
    reactions: string;
    threadId: string;
}