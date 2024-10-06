import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../../models/message.class';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private dummyChatMessages: Message[] = [
    new Message('avatar4.svg', 'Maria Musterfrau', 1, '1728206583002', '1728206583002', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi odio quia distinctio, a rem tenetur nihil iste saepe voluptates.'),
    new Message(),
    new Message(),
    new Message(),
    new Message(),
    new Message()
  ];

  private dummyThreadMessages: Message[] = [
    new Message('avatar4.svg', 'Maria Musterfrau', 1, '1728206583002', '1728206540532', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi odio quia distinctio, a rem tenetur nihil iste saepe voluptates.'),
    new Message(),
    new Message(),
    new Message()
  ];

  private chatMessages = new BehaviorSubject<Message[]>(this.dummyChatMessages);

  private threadMessages = new BehaviorSubject<Message[]>(this.dummyThreadMessages);

  private openThreadEvent = new BehaviorSubject<boolean>(false);

  constructor() { }

  changeThreadVisibility(bool: boolean) {
    this.openThreadEvent.next(bool);
    console.log(bool);
  }

  threadVisibilityListener() {
    return this.openThreadEvent.asObservable();
  }

  chatMessagesListener() {
    return this.chatMessages.asObservable();
  }

  threadMessagesListener() {
    return this.threadMessages.asObservable();
  }

  addChatMessage(message: Message) {
    const newMessages = [...this.chatMessages.value, message];
    this.chatMessages.next(newMessages);
  }

}
