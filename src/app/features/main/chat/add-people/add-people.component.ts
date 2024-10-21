import { Component, Signal } from '@angular/core';
import { Channel } from '../../../../core/models/channel.class';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { User } from '../../../../core/models/user.class';

@Component({
  selector: 'app-add-people',
  standalone: true,
  imports: [],
  templateUrl: './add-people.component.html',
  styleUrl: './add-people.component.scss'
})
export class AddPeopleComponent {
  currentChannel: Signal<Channel> = this.chatService.currentChannel;
  userOptions: User[] = [];
  selectedUser: User | undefined;

  constructor(private chatService: ChatService) { }

  closeDialog() {
    this.chatService.toggleAddPeopleVisibility();
  }

  findUsers(name: string) {
    if (name.length > 0) {
      return this.chatService.findUsers(name);
    } else {
      return [];
    }
  }

  onInputChange(input: any) {
    this.userOptions = this.findUsers(input.value);
  }

  selectUser(index: number) {
    this.selectedUser = this.userOptions[index];
  }

  removeSelectedUser() {
    this.selectedUser = undefined;
  }

  addPersonToCurrentChannel() {
    if (this.selectedUser) {
      this.chatService.addPersonToCurrentChannel(this.selectedUser.userUID);
      this.closeDialog();
    }
  }
}
