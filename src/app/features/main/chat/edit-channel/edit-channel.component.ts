import { Component, computed, ElementRef, Signal } from '@angular/core';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { Channel } from '../../../../core/models/channel.class';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {

  isChannelNameEditable: boolean = false;
  isChannelDescriptionEditable: boolean = false;
  currentChannel: Signal<Channel> = this.chatService.currentChannel;
  channels: Signal<Channel[]> = this.chatService.channels;
  channelNameError: boolean = false;

  constructor(private chatService: ChatService) {}

  toggleChannelNameEdit(channelName: string, channelNameInput: HTMLInputElement) {
    if (this.isChannelNameEditable) {
      this.channelNameError = false;
      const channel = this.channels().find(channel => channel.name === channelName);
      if (channel) {
        this.channelNameError = true;
        channelNameInput.value = this.currentChannel().name;
      } else {
        if (this.isChannelNameEditable) {
          this.chatService.updateChannel({
            name: channelName
          })
        }
      }
    } else {
      this.channelNameError = false;
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

  closeEditChannel() {
    this.chatService.toggleEditChannelVisibility();
  }

  leaveChannel() {
    this.chatService.leaveChannel();
  }
}
