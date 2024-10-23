import { Component, Input } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-textarea',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './message-textarea.component.html',
  styleUrl: './message-textarea.component.scss'
})
export class MessageTextareaComponent {
  @Input() placeholder: string = 'Nachricht an #';
  @Input() type: string = 'chat';
  messageText = '';

  constructor(private chatService: ChatService) { }

  addMessage() {
    if (this.messageText.length > 0) {
      if (this.type === 'chat') {
        this.chatService.addMessage(this.messageText, 'chat');
      } else if (this.type === 'thread') {
        this.chatService.addMessage(this.messageText, 'thread');
      }
      this.messageText = '';
    }
  }
}
