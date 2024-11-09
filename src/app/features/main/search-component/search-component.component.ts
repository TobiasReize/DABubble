import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user/user.service';
import { ChatUser } from '../../../core/models/user.class';
import { CommonModule } from '@angular/common';
import { SideNavService } from '../../../core/services/sideNav/side-nav.service';
import { ChatService } from '../../../core/services/chat/chat.service';
import { FirebaseService } from '../../../core/services/firebase/firebase.service';
import {
  collection,
  collectionGroup,
  CollectionReference,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

@Component({
  selector: 'app-search-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-component.component.html',
  styleUrl: './search-component.component.scss',
})
export class SearchComponentComponent implements OnInit {
  public userService = inject(UserService);
  public sideNavService = inject(SideNavService);
  public chatService = inject(ChatService);
  public fireBaseService = inject(FirebaseService);

  searchQuery: string = '';
  filteredResults: any[] = [];
  filteredChannels: any[] = [];
  directMessages: any[] = [];
  directMessagesContent: any[] = [];

  ngOnInit(): void {
    this.getMessages();
  }

  updateSearchQuery(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    const dropDown = document.getElementById('searchResultsDropdown');
    dropDown?.classList.remove('dNone');
    this.filterResults();
  }

  async getMessages() {
    const messagesRef = collectionGroup(
      this.fireBaseService.firestore,
      'messages'
    );
    const q = query(messagesRef, where('content', '!=', null));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      this.directMessages.push(doc.data());
      this.directMessagesContent.push(doc.data()['content']);
    });

    console.log('direktnachrichtenDokumente: ', this.directMessages);
  }

  filterResults() {
    const query = this.searchQuery.toLowerCase();

    // Benutzer filtern
    const filteredUsers = this.userService
      .allUsers()
      .filter((user) => user.name.toLowerCase().includes(query));

    // channels filtern
    const filteredChannels = this.chatService
      .channels()
      .filter((channel) => channel.name.toLowerCase().includes(query));

    // direkt Nachrichten filtern
    const filteredDirectMessages = 
    this.directMessages.filter((message) => message.content.toLowerCase().includes(query))

    this.filteredResults = [...filteredUsers, ...filteredChannels, ...filteredDirectMessages];
  }
}

  

  
