import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../../../core/services/user/user.service';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { ChatUser } from '../../../../core/models/user.class';

@Component({
  selector: 'app-at',
  standalone: true,
  imports: [],
  templateUrl: './at.component.html',
  styleUrl: './at.component.scss'
})
export class AtComponent {
  constructor(private userService: UserService, private chatService: ChatService) { }

  users = this.chatService.usersInCurrentChannelWithoutCurrentUser;
  @Output() selectUserEvent = new EventEmitter<ChatUser>();

  selectUser(index: number) {
    const user = this.users()[index];
    this.selectUserEvent.emit(user);
  }
}
