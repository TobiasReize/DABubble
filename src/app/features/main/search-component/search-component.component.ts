import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user/user.service';
import { ChatUser } from '../../../core/models/user.class';
import { CommonModule } from '@angular/common';
import { SideNavService } from '../../../core/services/sideNav/side-nav.service';
import { ChatService } from '../../../core/services/chat/chat.service';

@Component({
  selector: 'app-search-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-component.component.html',
  styleUrl: './search-component.component.scss',
})
export class SearchComponentComponent {

  public userService = inject(UserService);
  public sideNavService = inject(SideNavService);
  public chatService = inject(ChatService);

  searchQuery: string = '';
  filteredResults: any[] = [];
  filteredChannels: any[] = [];

  updateSearchQuery(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    this.filterResults();
    const dropDown = document.getElementById('searchResultsDropdown');
    dropDown?.classList.remove('dNone');
  }

  filterResults() {
    const query = this.searchQuery.toLowerCase();

    // Benutzer filtern
    const filteredUsers = this.userService.allUsers().filter((user) =>
      user.name.toLowerCase().includes(query)
    );

   // channels filtern
   const filteredChannels = this.chatService.channels().filter((channel) =>
    channel.name.toLowerCase().includes(query)
   );

    this.filteredResults = [...filteredUsers, ...filteredChannels];
  }
  }

