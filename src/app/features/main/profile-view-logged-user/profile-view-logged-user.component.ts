import { Component } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
  
  data = {
    name: this.userService.currentOnlineUser().name,
    email: this.userService.currentOnlineUser().email
  }
  
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

  saveNewContactInfos(ngForm: NgForm): void {
    if (ngForm.submitted && ngForm.form.valid) {
      this.chatService.profileViewLoggedUser = false;
      this.userService.updateUserEmailandName(this.userService.currentOnlineUser().userUID, this.data);
    }
  }
}
