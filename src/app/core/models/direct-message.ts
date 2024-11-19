export class directMessage {
    id: string;
    userIds: string[];
    message: string;
    
    constructor(id: string, userIds: string[], message: string) {
        this.id = id;
        this.userIds = userIds;
        this.message = message;
    }
}