export class User {
    name: string;
    email: string;
    password: string;
    avatar: string;
    userUID: string;
    userId: string


    constructor(obj?: any, userId?: string) {
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.password = '';
        this.avatar = obj ? obj.avatar : '';
        this.userUID = obj ? obj.userUID : '';
        this.userId = userId ? userId : '';
    }


    toJSON() {
        return {
          name: this.name,
          email: this.email,
          avatar: this.avatar,
          userUID: this.userUID,
          userId: this.userId
        }
      }

}