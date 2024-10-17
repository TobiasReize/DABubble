import { Component, inject } from '@angular/core';
import { MessageTextareaComponent } from '../../message-textarea/message-textarea.component';
import { ChatService } from '../../../../core/services/chat/chat.service';

@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [MessageTextareaComponent],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss'
})
export class DirectMessageComponent {

  constructor(public chatService: ChatService) {}

  openViewProfile() {
    this.chatService.profileViewUsersActive = true;
  }
}
