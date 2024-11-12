import { Component, Input, Signal } from '@angular/core';
import { ChatUser } from '../../../../core/models/user.class';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent {
  members: Signal<ChatUser[]> = this.chatService.usersInCurrentChannel;
  @Input('isEditChannel') isEditChannel: boolean = false;

  constructor(private chatService: ChatService) { }

  closeDialog() {
    this.chatService.toggleMembersVisibility();
  }

  openAddPeople() {
    this.chatService.toggleAddPeopleVisibility();
  }

  openViewProfile(userUID: string) {
    if (this.chatService.openMembers()) {
      this.chatService.toggleMembersVisibility();
    } else {
      this.chatService.toggleEditChannelVisibility();
    }
    this.chatService.openViewProfile(userUID);
  }
}
