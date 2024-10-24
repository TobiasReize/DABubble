export class User {
    name: string;
    email: string;
    password: string;
    avatar: string;
    userUID: string;


    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.password = '';
        this.avatar = obj ? obj.avatar : '';
        this.userUID = obj ? obj.userUID : '';
    }


    toJSON() {
        return {
          name: this.name,
          email: this.email,
          avatar: this.avatar,
          userUID: this.userUID,
        }
      }

}