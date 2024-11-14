import { Component } from '@angular/core';
import { MessageTextareaComponent } from '../../message-textarea/message-textarea.component';
import { CommonModule } from '@angular/common';
import { SideNavService } from '../../../../core/services/sideNav/side-nav.service';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { UserService } from '../../../../core/services/user/user.service';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [MessageTextareaComponent, CommonModule],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {
  constructor(public sideNavService: SideNavService, public chatService: ChatService, public userService: UserService) {}
  filteredUsers: any[] = [];
  searchQuery: string = '';
  
  showFilteredContacts() {

  }

  updateSearchQuery(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    const dropDown = document.getElementById('newMessageOnContact');
    dropDown?.classList.remove('dNone');
    this.filterResults();
  }

  async filterResults() {
    this.filteredUsers = [];
    const query = this.searchQuery.toLowerCase();

    const filteredUsers = this.userService
      .allUsers()
      .filter((user) => user.name.toLowerCase().includes(query));

    const filteredChannels = this.chatService
      .channels()
      .filter((channel) => channel.name.toLowerCase().includes(query));

    this.filteredUsers = [
      ...filteredUsers,
      ...filteredChannels,
    ];

    console.log(filteredUsers);
  }
}
