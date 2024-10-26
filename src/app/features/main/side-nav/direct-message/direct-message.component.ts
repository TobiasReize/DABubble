import { Component, inject } from '@angular/core';
import { MessageTextareaComponent } from '../../message-textarea/message-textarea.component';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user/user.service';

@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [MessageTextareaComponent, CommonModule],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
})
export class DirectMessageComponent {
  constructor(
    public chatService: ChatService,
    public userService: UserService
  ) {}

  openViewProfile(contactName: string) {
    if (
      this.userService.allUsers[this.chatService.contactIndex].name ==
      this.userService.currentOnlineUser.name
    ) {
      this.chatService.profileViewLoggedUser = true;
    } else {
      this.chatService.profileViewUsersActive = true;
    }
  }
}
