import { Injectable } from '@angular/core';

interface Channel {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class SideNavService {
  public channels: Channel[] = [];

  constructor() {}

  addChannel(channel: Channel): void {
    this.channels.push(channel);
    console.log(this.channels);
  }

  getChannels(): Channel[] {
    return this.channels;
  }

  createChannelsDivOpened: boolean = false;
  contactsOpened: boolean = true;
}
