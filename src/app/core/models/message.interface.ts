export interface MessageInterface {
    imageName: string;
    userName: string;
    postedAtAsString: string;
    lastReplyAtAsString: string | undefined;
    content: string;
    reactions: string;
    replyIds: string;
}