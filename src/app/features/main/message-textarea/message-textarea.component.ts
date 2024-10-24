import { Component, Input, Signal } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';
import { FormsModule } from '@angular/forms';
import { AtComponent } from './at/at.component';

@Component({
  selector: 'app-message-textarea',
  standalone: true,
  imports: [AtComponent, FormsModule],
  templateUrl: './message-textarea.component.html',
  styleUrl: './message-textarea.component.scss'
})
export class MessageTextareaComponent {
  @Input() placeholder: string = 'Nachricht an #';
  @Input() type: string = 'chat';
  messageText = '';
  isAtVisible: Signal<boolean> = this.chatService.opentAt;

  constructor(private chatService: ChatService) { }

  addMessage() {
    if (this.messageText.length > 0) {
      if (this.type === 'chat') {
        this.chatService.addChatMessage(this.messageText);
      } else if (this.type === 'thread') {
        this.chatService.addThreadReply(this.messageText);
      }
      this.messageText = '';
    }
  }

  toggleAtVisibility() {
    this.chatService.toggleAtVisibility();
  }
}
