import { Component, Input } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';

@Component({
  selector: 'app-message-textarea',
  standalone: true,
  imports: [],
  templateUrl: './message-textarea.component.html',
  styleUrl: './message-textarea.component.scss'
})
export class MessageTextareaComponent {
  @Input() placeholder: string = 'Nachricht an #';

  constructor(private chatService: ChatService) { }

  addMessage() {
    this.chatService.addChatMessage('');
  }
}
