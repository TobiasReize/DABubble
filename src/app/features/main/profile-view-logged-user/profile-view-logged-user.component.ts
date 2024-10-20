import { Component } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';

@Component({
  selector: 'app-profile-view-logged-user',
  standalone: true,
  imports: [],
  templateUrl: './profile-view-logged-user.component.html',
  styleUrl: './profile-view-logged-user.component.scss'
})
export class ProfileViewLoggedUserComponent {
  constructor(public chatService: ChatService) {}

  onDiv1Click(): void {
    this.chatService.profileViewUsersActive = false;
  }

  onDiv2Click(event: MouseEvent): void {
    event.stopPropagation();
  }
}
