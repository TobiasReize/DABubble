export class ChatUser {
    name: string;
    email: string;
    password: string;
    avatar: string;
    userUID: string;
    isOnline: boolean;


    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.password = '';
        this.avatar = obj ? obj.avatar : '';
        this.userUID = obj ? obj.userUID : '';
        this.isOnline = obj ? obj.isOnline : false;
    }


    toJSON() {
        return {
          name: this.name,
          email: this.email,
          avatar: this.avatar,
          userUID: this.userUID,
          isOnline: this.isOnline
        }
      }

}