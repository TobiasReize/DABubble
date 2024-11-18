import { Component, effect, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { SideNavService } from '../../../core/services/sideNav/side-nav.service';
import { ChatService } from '../../../core/services/chat/chat.service';
import { FirebaseService } from '../../../core/services/firebase/firebase.service';
import {
  collectionGroup,
  getDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { directMessage } from '../../../core/models/direct-message';

@Component({
  selector: 'app-search-component',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './search-component.component.html',
  styleUrl: './search-component.component.scss',
})
export class SearchComponentComponent {
  public userService = inject(UserService);
  public sideNavService = inject(SideNavService);
  public chatService = inject(ChatService);
  public fireBaseService = inject(FirebaseService);

  searchQuery: string = '';
  filteredResults: any[] = [];
  filteredChannels: any[] = [];
  messages: directMessage[] = [];
  showDropDown: boolean = false;
  searchComponentInputControl = new FormControl('');

  @Input('placeholder') placeholder: string = 'Suchen...';

  @ViewChild('searchComponentInput') inputRef!: ElementRef;

  constructor() {
    effect(() => {
      if (this.userService.allUsers().length > 0 || this.chatService.channels().length > 0) {
        this.getDirectMessages();
        this.filterResults();
      }
    })
  }

  resetInput() {
    this.searchComponentInputControl.reset();
    this.showDropDown = false;
  }
 
  updateSearchQuery(value: string) {
    this.searchQuery = value;
    if (value === "") {
      this.showDropDown = false;
    } else {
      this.filterResults();
      if (this.filteredResults.length > 0) {
        this.showDropDown = true;
      }
    }
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
          const userIds: any = directMessageChannelDocData!['userIds'];
          // const otherUserId: string = userIds?.find((id) => id !== this.userService.currentOnlineUser().userUID) || '';
          const messageObject = new directMessage(
            directMessageChannelDoc.id,
            // otherUserId,
            userIds,
            docData['content']
          );

          this.messages.push(messageObject);
        }
      });
    });
  }
}
