import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../../models/message.class';
import { Reaction } from '../../models/reaction.class';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private dummyChatMessages: Message[] = [
    new Message('avatar4.svg', 'Maria Musterfrau', new Date('2024-10-03'), new Date('2024-10-03'), 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', [new Reaction()], [new Message()]),
    new Message(),
    new Message(),
    new Message(),
    new Message(),
    new Message()
  ];

  private chatMessages = new BehaviorSubject<Message[]>(this.dummyChatMessages);

  private threadMessage = new BehaviorSubject<Message>(new Message());

  private openThreadEvent = new BehaviorSubject<boolean>(false);

  constructor() { }

  changeThreadVisibility(bool: boolean) {
    this.openThreadEvent.next(bool);
  }

  changeThread(message: Message) {
    this.threadMessage.next(message);
  }

  threadVisibilityListener() {
    return this.openThreadEvent.asObservable();
  }

  chatMessagesListener() {
    return this.chatMessages.asObservable();
  }

  threadMessagesListener() {
    return this.threadMessage.asObservable();
  }

  addChatMessage(message: Message) {
    const newMessages = [...this.chatMessages.value, message];
    this.chatMessages.next(newMessages);
  }

}
