import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SideNavService } from '../../../core/services/sideNav/side-nav.service';
import { ChatService } from '../../../core/services/chat/chat.service';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  channelsOpened: boolean = false;

  constructor(
    public sideNavService: SideNavService,
    public chatService: ChatService,
    public userService: UserService,
  ) {}

  openChannels(): void {
    this.channelsOpened = !this.channelsOpened;
  }

  openCreateChannels(): void {
    this.sideNavService.createChannelsDivOpened = true;
  }

  closeContactDiv(): void {
    this.sideNavService.contactsOpened = !this.sideNavService.contactsOpened;
  }

  newMessage(): void {
    this.chatService.newMessage = true;
    this.chatService.chat = false;
    this.chatService.directMessage = false;
  }

  selectChannel(id:number) {
    const channelElements = document.querySelectorAll('.entwicklerTeam');
    channelElements.forEach(element => {
      element.classList.remove('channelWasChoosed');
    });
    const selectedDiv = document.getElementById('channelDivID' + id);
    selectedDiv!.classList.add('channelWasChoosed');
  }
}
