import { Component, Signal } from '@angular/core';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { Channel } from '../../../../core/models/channel.class';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {
  constructor(private chatService: ChatService) {}

  currentChannel: Signal<Channel> = this.chatService.currentChannel;
}
