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
  
  inputFinished: boolean = false;
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

  async saveNewContactInfos(ngForm: NgForm): Promise<void> {
    if (ngForm.submitted && ngForm.form.valid) {
      if (this.data.email == this.userService.currentOnlineUser().email) {
        await this.userService.updateUserDoc(this.userService.currentOnlineUser().userUID, this.data);
        this.chatService.profileViewLoggedUser = false;
      } else {
        await this.userService.updateUserEmailandName(this.userService.currentOnlineUser().userUID, this.data);
        this.inputFinished = true;
        setTimeout(() => {
          this.inputFinished = false;
          this.chatService.profileViewLoggedUser = false;
        }, 1300);
      }
    }
  }

}