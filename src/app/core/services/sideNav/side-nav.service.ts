import { Injectable } from '@angular/core';
import { ChatService } from '../chat/chat.service';

interface Channel {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class SideNavService {
  public channels: Channel[] = [];
  search: boolean = false;
  createChannelsDivOpened: boolean = false;
  contactsOpened: boolean = true;
 

  constructor(public chatService: ChatService) {}

  searchDevSpace() {
    this.search = true;
  }

  addChannel(channel: Channel): void {
    this.channels.push(channel);
    console.log(this.channels);
  }

  getChannels(): Channel[] {
    return this.channels;
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  
}
