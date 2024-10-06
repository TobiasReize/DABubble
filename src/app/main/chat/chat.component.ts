import { Component } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { Message } from '../../models/message.class';
import { ChatService } from '../services/chat.service';
import { Subscription } from 'rxjs';
import { MessageTextareaComponent } from '../message-textarea/message-textarea.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MessageComponent, MessageTextareaComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  channelName: string = 'Entwicklerteam';

  constructor(private chatService: ChatService) { }

  messages: Message[] = [];

  messagesSubscription!: Subscription;

  ngOnInit() {
    this.messagesSubscription = this.chatService.chatMessagesListener().subscribe((messages) => {
      this.messages = messages;
    });
  }

  ngOnDestroy() {
    this.messagesSubscription.unsubscribe();
  }

  sendMessage(message: Message) {
    this.chatService.addChatMessage(message);
  }

  isSameDay(firstDate: Date, secondDate: Date) {
    return firstDate.getFullYear() == secondDate.getFullYear() && firstDate.getMonth() == secondDate.getMonth() && firstDate.getDate() == secondDate.getDate();
  }

  isAnotherDay(messageA: Message, messageB: Message) {
    const firstDate = messageA.postedAt;
    const secondDate = messageB.postedAt;
    if (this.isSameDay(firstDate, secondDate)) {
      return false;
    } else {
      return true;
    }
  }

  getLongGermanDate(date: Date) {
    return date.toLocaleDateString("de-DE", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  getDateInfo(message: Message) {
    const today = new Date();
    if (this.isSameDay(message.postedAt, today)) {
      return 'Heute';
    } else {
      return this.getLongGermanDate(message.postedAt);
    }
  }
}
