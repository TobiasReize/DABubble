export class User {
    name: string;
    email: string;
    password: string;
    avatar: string;
    userUID: string;
    
    
    constructor() {
        this.name = '';
        this.email = '';
        this.password = '';
        this.avatar = '';
        this.userUID = '';
    }


    toJSON() {
        return {
          name: this.name,
          email: this.email,
          password: this.password,
          avatar: this.avatar,
          userUID: this.userUID,
        }
      }

}