import { Component } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { doc, updateDoc } from 'firebase/firestore';
import { FirebaseService } from '../../../core/services/firebase/firebase.service';

@Component({
  selector: 'app-profile-view-logged-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-view-logged-user.component.html',
  styleUrl: './profile-view-logged-user.component.scss',
})
export class ProfileViewLoggedUserComponent {
  constructor(
    public chatService: ChatService,
    public fireBaseService: FirebaseService
  ) {}

  onDiv1Click(): void {
    this.chatService.profileViewLoggedUser = false;
    this.chatService.customProfile = false;
  }

  onDiv2Click(event: MouseEvent): void {
    event.stopPropagation();
  }

  customProfile(event: MouseEvent) {
    this.chatService.customProfile = true;
    this.onDiv2Click(event);
  }

  getCleanName(): string {
    const cleanUserName: string = this.chatService.currentUser
      .replace('(Du)', '')
      .trim();
    return cleanUserName;
  }

  saveNewContactInfos(): void {
    const fullname = document.getElementById('fullname') as HTMLInputElement;
    const email = document.getElementById('emailAdresse') as HTMLInputElement;

    let splitedName = fullname.value.split(' ');

    this.chatService.currentUser = fullname.value;
    this.chatService.currentUsersEmail = email.value;
    this.chatService.profileViewLoggedUser = false;

    const docRef = doc(
      this.fireBaseService.firestore,
      'contacts',
      this.chatService.contacts[this.chatService.contactIndex]['id']
    );
    updateDoc(docRef, {
      vorname: splitedName[0],
      nachname: splitedName[1],
      email: email.value,
    });
  }
}
