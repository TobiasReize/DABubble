import { MessageInterface } from "./message.interface";
import { Reaction } from "./reaction.class";

export class Message {
    constructor(
        public id: string = '',
        public imageName: string = '',
        public userName: string = '',
        public postedAt: Date = new Date(),
        public lastReplyAt: Date | undefined = undefined,
        public content: string = '',
        public reactions: Reaction[] = [],
        public numberOfReplies: number = 0,
        public fileUrl: string = '',
        public fileType: string = '',
        public fileName: string = '',
        public senderId: string = ''
    ) {}

    toJson(): MessageInterface {
        return {
            imageName: this.imageName,
            userName: this.userName,
            postedAt: this.postedAt.getTime(),
            lastReplyAt: this.lastReplyAt ? this.lastReplyAt.getTime() : 0,
            content: this.content,
            reactions: JSON.stringify(this.reactions),
            numberOfReplies: this.numberOfReplies,
            fileUrl: this.fileUrl,
            fileType: this.fileType,
            fileName: this.fileName,
            senderId: this.senderId
        }
    }
}