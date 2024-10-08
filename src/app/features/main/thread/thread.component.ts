import { Component, Signal } from '@angular/core';
import { Message } from '../../../core/models/message.class';
import { MessageComponent } from '../message/message.component';
import { CommonModule } from '@angular/common';
import { MessageTextareaComponent } from '../message-textarea/message-textarea.component';
import { ChatService } from '../../../core/services/chat/chat.service';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [MessageComponent, MessageTextareaComponent, CommonModule],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  
  channelName: string = 'Entwicklerteam';
  
  constructor(private chatService: ChatService) { }

  message: Signal<Message> = this.chatService.threadMessage;

  closeThread() {
    this.chatService.changeThreadVisibility(false);
  }
}
