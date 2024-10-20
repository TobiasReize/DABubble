import { Component, Signal } from '@angular/core';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { Channel } from '../../../../core/models/channel.class';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {

  isChannelNameEditable: boolean = false;
  isChannelDescriptionEditable: boolean = false;
  currentChannel: Signal<Channel> = this.chatService.currentChannel;

  constructor(private chatService: ChatService) {}

  toggleChannelNameEdit(channelName: string) {
    if (this.isChannelNameEditable) {
      this.chatService.updateChannel({
        name: channelName
      })
    }
    this.isChannelNameEditable = !this.isChannelNameEditable;
  }

  toggleChannelDescriptionEdit(channelDescription: string) {
    if (this.isChannelDescriptionEditable) {
      this.chatService.updateChannel({
        description: channelDescription
      })
    }
    this.isChannelDescriptionEditable = !this.isChannelDescriptionEditable;
  }
}
