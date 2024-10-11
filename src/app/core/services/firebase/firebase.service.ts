import { Injectable } from '@angular/core';
import { MessageInterface } from '../../models/message.interface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() { }

  addMessage(messageObj: MessageInterface) {
    console.log(messageObj);
  }
}
