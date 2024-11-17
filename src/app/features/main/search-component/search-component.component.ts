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
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { Message } from '../../../core/models/message.class';
import { directMessage } from '../../../core/models/direct-message';

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
  messages: directMessage[] = [];

  ngOnInit(): void {
    this.getDirectMessages();
  }

  updateSearchQuery(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    const dropDown = document.getElementById('searchResultsDropdown');
    dropDown?.classList.remove('dNone');
    this.filterResults();
  }

  async filterResults() {
    this.filteredResults = [];
    const query = this.searchQuery.toLowerCase();

    const filteredUsers = this.userService
      .allUsers()
      .filter((user) => user.name.toLowerCase().includes(query));

    const filteredChannels = this.chatService
      .channels()
      .filter((channel) => channel.name.toLowerCase().includes(query));

    const filteredDirectMessages = this.messages.filter((message) =>
      message.message.toLowerCase().includes(query)
    );

    this.filteredResults = [
      ...filteredUsers,
      ...filteredChannels,
      ...filteredDirectMessages,
    ];
  }

  async getDirectMessages() {
    const messagesRef = collectionGroup(
      this.fireBaseService.firestore,
      'messages'
    );

    const q = query(messagesRef, where('content', '!=', null));

    onSnapshot(q, (querySnapshot) => {
      this.messages = [];

      querySnapshot.forEach(async (doc) => {
        this.messages = [];
        const docData = doc.data();

        const messagesCollectionRef = doc.ref.parent;
        const directMessageChannelsDocRef = messagesCollectionRef.parent;

        if (directMessageChannelsDocRef) {
          const directMessageChannelDoc = await getDoc(
            directMessageChannelsDocRef
          );
          const directMessageChannelDocData = directMessageChannelDoc.data();
          const userIds: string[] = directMessageChannelDocData!['userIds'];
          const otherUserId: string = userIds?.find((id) => id !== this.userService.currentOnlineUser().userUID) || '';
          const messageObject = new directMessage(
            directMessageChannelDoc.id,
            otherUserId,
            docData['content']
          );

          this.messages.push(messageObject);
        }
      });
    });
  }
}
