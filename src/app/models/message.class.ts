import { Reaction } from "./reaction.class";

export class Message {
    constructor(
        public imageName: string = 'avatar1.svg',
        public userName: string = 'Max Mustermann',
        public numberOfReplies: number = 0,
        public postedAt: Date = new Date(),
        public lastReplyAt: Date = new Date(),
        public content: string = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi odio quia distinctio, a rem tenetur nihil iste saepe voluptates.',
        public reactions: Reaction[] = [new Reaction('2705.svg', ['Maria Mustermann']), new Reaction]
    ) {}

    toJson() {
        return {
            imageName: this.imageName,
            userName: this.userName,
            numberOfReplies: this.numberOfReplies,
            postedAtAsString: this.postedAt.getTime(),
            lastReplyAtAsString: this.lastReplyAt.getTime(),
            content: this.content,
            reactions: this.reactions
        }
    }
}