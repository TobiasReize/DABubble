export class Channel {
    constructor(
        public id: string = '',
        public name: string = '',
        public description: string = '',
        public userIds: string[] = ['']
    ) {}
}