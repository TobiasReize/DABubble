import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  introDone: boolean = false;

  currentOnlineUser = {
    email: '',
    password: ''
  };

  newUser = {
    name: '',
    email: '',
    password: '',
    avatar: ''
  };


  constructor() { }


}