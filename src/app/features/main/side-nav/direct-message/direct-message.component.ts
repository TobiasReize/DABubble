import { Component, inject } from '@angular/core';
import { MessageTextareaComponent } from '../../message-textarea/message-textarea.component';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [MessageTextareaComponent, CommonModule],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss'
})
export class DirectMessageComponent {

  constructor(public chatService: ChatService) {}

  

  openViewProfile(contactName: string) {
    if(contactName.includes('(Du)')) {
      this.chatService.profileViewLoggedUser = true;
    } else {
      this.chatService.profileViewUsersActive = true;
    }
  }
}
