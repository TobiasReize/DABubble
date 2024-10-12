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
  messageText = '';

  constructor(private chatService: ChatService) { }

  addMessage() {
    this.chatService.addChatMessage(this.messageText);
  }
}
