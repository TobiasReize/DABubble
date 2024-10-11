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
        public replies: Message[] = []
    ) {}

    toJson(): MessageInterface {
        const replyIdsForJson: any[]  = [];
        if (this.replies.length > 0) {
            this.replies.forEach(reply => {
                replyIdsForJson.push(reply.id);
            })
        }
        return {
            imageName: this.imageName,
            userName: this.userName,
            postedAtAsString: `${this.postedAt.getTime()}`,
            lastReplyAtAsString: `${this.lastReplyAt ? this.lastReplyAt.getTime() : ''}`,
            content: this.content,
            reactions: JSON.stringify(this.reactions),
            replyIds: JSON.stringify(replyIdsForJson)
        }
    }
}