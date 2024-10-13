import { MessageInterface } from "./message.interface";
import { Reaction } from "./reaction.class";

export class Message {
    constructor(
        public id: string = '',
        public imageName: string = 'avatar1.svg',
        public userName: string = 'Max Mustermann',
        public postedAt: Date = new Date(),
        public lastReplyAt: Date | undefined = undefined,
        public content: string = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi odio quia distinctio, a rem tenetur nihil iste saepe voluptates.',
        public reactions: Reaction[] = [new Reaction('2705.svg', ['Marina Mustermann']), new Reaction()],
        public threadId: string = ''
    ) {}

    toJson(): MessageInterface {
        return {
            imageName: this.imageName,
            userName: this.userName,
            postedAt: this.postedAt.getTime(),
            lastReplyAt: this.lastReplyAt ? this.lastReplyAt.getTime() : 0,
            content: this.content,
            reactions: JSON.stringify(this.reactions),
            threadId: this.threadId
        }
    }
}