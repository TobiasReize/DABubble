import { Component, inject } from '@angular/core';
import { MessageTextareaComponent } from '../../message-textarea/message-textarea.component';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user/user.service';
import { ChatComponent } from '../../chat/chat.component';
import { Message } from '../../../../core/models/message.class';


@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [MessageTextareaComponent, CommonModule, ChatComponent],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
})
export class DirectMessageComponent {
  constructor(
    public chatService: ChatService,
    public userService: UserService,
  ) {}

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

  isSameDay(firstDate: Date, secondDate: Date) {
    return firstDate.getFullYear() == secondDate.getFullYear() && firstDate.getMonth() == secondDate.getMonth() && firstDate.getDate() == secondDate.getDate();
  }

  getLongGermanDate(date: Date) {
    return date.toLocaleDateString("de-DE", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }
}
