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
    // this.getMessages();s
    this.loadData();
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
  
    onSnapshot(q, (querySnapshot) => {
      this.directMessages = [];
      this.directMessagesContent = [];
  
      querySnapshot.forEach(async (doc) => {
        const docData = doc.data();
        this.directMessages.push(docData);
        this.directMessagesContent.push(docData['content']);
  
        const messagesCollectionRef = doc.ref.parent;
        const directMessageChannelsDocRef = messagesCollectionRef.parent;

        if(directMessageChannelsDocRef) {
          const directMessageChannelDoc = await getDoc(directMessageChannelsDocRef);
          
        }
      });
  
      
    });
  }

  async loadData() {
    const resultsArray = []; // Array, in dem alle Daten gespeichert werden
  
    // 1. Hauptabfrage für die directMessageChannels-Dokumente
    const directMessageChannelsRef = collection(this.fireBaseService.firestore, 'directMessageChannels');
    const directMessageChannelsSnapshot = await getDocs(directMessageChannelsRef);
  
    // 2. Für jedes directMessageChannels-Dokument die Nachrichten abrufen und zusammenführen
    for (const directDoc of directMessageChannelsSnapshot.docs) {
      const directData = directDoc.data();
      directData['id'] = directDoc.id; // Falls die Dokument-ID gebraucht wird
  
      // 3. Unterkollektion `messages` abrufen
      const messagesRef = collection(directDoc.ref, 'messages');
      const messagesSnapshot = await getDocs(messagesRef);
  
      // 4. Nachrichten in ein Array packen
      const messagesArray = messagesSnapshot.docs.map((messageDoc) => ({
        id: messageDoc.id, // Falls die Nachricht-ID gebraucht wird
        ...messageDoc.data()
      }));
  
      // 5. Nachrichten dem Hauptdokument hinzufügen
      directData['messages'] = messagesArray;
  
      // 6. Hauptdokument mit Nachrichten in das Ergebnisarray einfügen
      resultsArray.push(directData);
    }
  
    // 7. Ergebnisse speichern, damit sie in der Vorlage verwendet werden können
    return resultsArray;
  }
  
  async filterResults() {
    this.loadData()
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
    const filteredDirectMessages = this.directMessages.filter((message) =>
      message.content.toLowerCase().includes(query)
    );

    let loadedMessages;

    // if(loadedMessages?.lengt) {
    //   loadedMessages = await this.loadData();
    // }
    

    this.filteredResults = [
      ...filteredUsers,
      ...filteredChannels,
      ...filteredDirectMessages,
      // ...loadedMessages
    ];
  }
}
