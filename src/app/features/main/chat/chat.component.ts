import { Component, Signal } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';
import { MessageTextareaComponent } from '../message-textarea/message-textarea.component';
import { Message } from '../../../core/models/message.class';
import { MessageComponent } from '../message/message.component';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MessageTextareaComponent, MessageComponent, SlicePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  channelName: string = 'Entwicklerteam';
  userAvatars: string[] = ['avatar0.svg', 'avatar1.svg', 'avatar2.svg', 'avatar3.svg', 'avatar4.svg', 'avatar5.svg'];

  constructor(private chatService: ChatService) { }

  messages: Signal<Message[]> = this.chatService.messages;

  toggleEditChannelVisibility() {
    this.chatService.toggleEditChannelVisibility();
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
    if (message) {
      const today = new Date();
      if (this.isSameDay(message.postedAt, today)) {
        return 'Heute';
      } else {
        return this.getLongGermanDate(message.postedAt);
      }
    } else {
      return '';
    }
  }
}
