import { Component, Signal } from '@angular/core';
import { User } from '../../../../core/models/user.class';
import { ChatService } from '../../../../core/services/chat/chat.service';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent {
  members: Signal<User[]> = this.chatService.usersInCurrentChannel;

  constructor(private chatService: ChatService) { }

  closeDialog() {
    this.chatService.toggleMembersVisibility();
  }

  openAddPeople() {
    this.chatService.toggleAddPeopleVisibility();
  }
}
