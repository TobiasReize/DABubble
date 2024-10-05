import { Component, EventEmitter, Output } from '@angular/core';
import { Message } from '../../models/message.class';
import { MessageComponent } from '../message/message.component';
import { CommonModule } from '@angular/common';
import { ChatService } from '../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [MessageComponent, CommonModule],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  
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

  closeThread() {
    this.chatService.changeThreadVisibility(false);
  }
}
