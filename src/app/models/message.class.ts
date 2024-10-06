import { Reaction } from "./reaction.class";

export class Message {
    constructor(
        public imageName: string = 'avatar1.svg',
        public userName: string = 'Max Mustermann',
        public numberOfReplies: number = 0,
        public postedAt: Date = new Date(),
        public lastReplyAt: Date = new Date(),
        public content: string = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi odio quia distinctio, a rem tenetur nihil iste saepe voluptates.',
        public reactions: Reaction[] = [new Reaction('2705.svg', ['Maria Mustermann']), new Reaction],
        public replies: Message[] = []
    ) {}

    toJson() {
        // Message interface to be added:
        const repliesForJson: any[]  = [];
        if (this.replies.length > 0) {
            this.replies.forEach(reply => {
                repliesForJson.push(reply.toJson());
            })
        }
        return {
            imageName: this.imageName,
            userName: this.userName,
            numberOfReplies: this.numberOfReplies,
            postedAtAsString: this.postedAt.getTime(),
            lastReplyAtAsString: this.lastReplyAt.getTime(),
            content: this.content,
            reactions: this.reactions,
            repliesAsString: JSON.stringify(repliesForJson)
        }
    }
}