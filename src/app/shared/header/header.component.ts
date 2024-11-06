import { Component, inject, NgModule } from '@angular/core';
import { UserService } from '../../core/services/user/user.service';
import { Router } from '@angular/router';
import { ChatService } from '../../core/services/chat/chat.service';
import { FormsModule } from '@angular/forms';
import { SearchComponentComponent } from "../../features/main/search-component/search-component.component";
import { SideNavService } from '../../core/services/sideNav/side-nav.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, SearchComponentComponent],
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
  }  sideNavService = inject(SideNavService);

  onSearch() {
    this.sideNavService.search = true;
  }
}
