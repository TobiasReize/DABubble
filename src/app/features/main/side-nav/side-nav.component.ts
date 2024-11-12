import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SideNavService } from '../../../core/services/sideNav/side-nav.service';
import { ChatService } from '../../../core/services/chat/chat.service';
import { UserService } from '../../../core/services/user/user.service';
import { LayoutService } from '../../../core/services/layout/layout.service';

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
    private layoutService: LayoutService
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
    this.layoutService.selectNewMessage();
  }

  selectChannel(id:number) {
    this.chatService.directMessage = false;
    this.chatService.chat = true;
    const channelElements = document.querySelectorAll('.entwicklerTeam');
    channelElements.forEach(element => {
      element.classList.remove('channelWasChoosed');
    });
    const selectedDiv = document.getElementById('channelDivID' + id);
    selectedDiv!.classList.add('channelWasChoosed');
  }
}
