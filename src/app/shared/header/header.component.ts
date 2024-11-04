import { Component, inject } from '@angular/core';
import { UserService } from '../../core/services/user/user.service';
import { Router } from '@angular/router';
import { ChatService } from '../../core/services/chat/chat.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  userService = inject(UserService);
  chatService = inject(ChatService);
  profilInfo: boolean = false;

  constructor(private router: Router) { }


  toggleProfilInfo() {
    this.profilInfo = !this.profilInfo;
  }


  showProfile() {
    this.toggleProfilInfo();    
    this.chatService.openViewProfile(this.userService.currentUserUID());
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  }


  async logout() {
    await this.userService.signOutUser();
    this.router.navigateByUrl('');
  }
}
