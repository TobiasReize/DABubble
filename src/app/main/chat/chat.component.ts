import { Component } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { Message } from '../../models/message.class';
import { ChatService } from '../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MessageComponent],
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
}
