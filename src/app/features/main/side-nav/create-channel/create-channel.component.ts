import { Component, HostListener } from '@angular/core';
import { SideNavService } from '../../../../core/services/sideNav/side-nav.service';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { UserService } from '../../../../core/services/user/user.service';
import { Channel } from '../../../../core/models/channel.class';
import { collection, doc, setDoc } from 'firebase/firestore';
import { FirebaseService } from '../../../../core/services/firebase/firebase.service';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss',
})
export class CreateChannelComponent {
  constructor(public sideNavService: SideNavService, public chatService: ChatService, public userService: UserService, public fireBaseService: FirebaseService) {}

  userUIDs: string[] = [];
  channelId: string = "";

  onDiv1Click(): void {
    this.sideNavService.createChannelsDivOpened = false;
  }

  onDiv2Click(event: MouseEvent): void {
    event.stopPropagation();
  }

  async createChannel() {
    let channelName: HTMLInputElement = document.getElementById('input1') as HTMLInputElement;
    let description: HTMLInputElement = document.getElementById('input2') as HTMLInputElement;

    let channel = new Channel(
      this.chatService.contactIndex,
      channelName.value,
      description.value,
      this.userUIDs,
      this.userService.currentOnlineUser.name
    )

    this.channelId = doc(collection(this.fireBaseService.firestore, "channels")).id;

    this.sideNavService.addChannel(channel);

    await setDoc(doc(this.fireBaseService.firestore, "channels", this.channelId), {
      name: channelName.value,
      description: description.value,
      createdBy: this.userService.currentOnlineUser.name,
      userIds: this.userUIDs
    });
  }
}
