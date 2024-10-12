import { Component, HostListener } from '@angular/core';
import { SideNavService } from '../../../../core/services/sideNav/side-nav.service';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss',
})
export class CreateChannelComponent {
  constructor(public sideNavService: SideNavService) {}

  onDiv1Click(): void {
    this.sideNavService.createChannelsDivOpened = false;
  }

  onDiv2Click(event: MouseEvent): void {
    event.stopPropagation();
  }

  createChannel(): void {
    let channel: HTMLInputElement = document.getElementById('input1') as HTMLInputElement;
    let description: HTMLInputElement = document.getElementById('input2') as HTMLInputElement;

    const newChannel = {
      name: channel.value,
      description: description.value
    };

    this.sideNavService.addChannel(newChannel);
    this.onDiv1Click();

  }
}
