export class Message {
    constructor(
        public imageName: string = 'avatar1.svg',
        public userName: string = 'Max Mustermann',
        public numberOfReplies: number = 0,
        public postedAt: string = '00:00',
        public lastReplyAt: string = '00:00',
        public content: string = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi odio quia distinctio, a rem tenetur nihil iste saepe voluptates.'
    ) {}
}