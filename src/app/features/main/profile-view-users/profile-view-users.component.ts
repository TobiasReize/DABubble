import { Component } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';

@Component({
  selector: 'app-profile-view-users',
  standalone: true,
  imports: [],
  templateUrl: './profile-view-users.component.html',
  styleUrl: './profile-view-users.component.scss',
})
export class ProfileViewUsersComponent {
  constructor(public chatService: ChatService) {}

  onDiv1Click(): void {
    this.chatService.profileViewUsersActive = false;
  }

  onDiv2Click(event: MouseEvent): void {
    event.stopPropagation();
  }
}
