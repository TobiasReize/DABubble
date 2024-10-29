import { Component } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { doc, updateDoc } from 'firebase/firestore';
import { FirebaseService } from '../../../core/services/firebase/firebase.service';
import { UserService } from '../../../core/services/user/user.service';

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
    public fireBaseService: FirebaseService,
    public userService: UserService
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

  saveNewContactInfos(): void {
    const fullname = document.getElementById('fullname') as HTMLInputElement;
    const email = document.getElementById('emailAdresse') as HTMLInputElement;

    this.chatService.profileViewLoggedUser = false;

    this.userService.allUsers()[this.chatService.contactIndex].name = fullname.value;
    this.userService.allUsers()[this.chatService.contactIndex].email = email.value;

    const docRef = doc(
      this.fireBaseService.firestore,
      'users',
      this.userService.allUsers()[this.chatService.contactIndex].userUID
    );
    updateDoc(docRef, {
      name: fullname.value,
      email: email.value,
    });

    // this.userService.updateUserAuthEmail(email.value);
  }
}
