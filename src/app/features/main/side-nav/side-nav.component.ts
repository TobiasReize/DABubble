import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SideNavService } from '../../../core/services/sideNav/side-nav.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  contacts = [0, 1, 2, 3, 4, 5];
  names = [
    'Frederik Beck (Du)',
    'Sofia Müller',
    'Noah Braun',
    'Elise Roth',
    'Elias Neumann',
    'Steffen Hoffmann',
  ];

  channelsOpened: boolean = false;

  constructor(public sideNavService: SideNavService) {}

  openChannels(): void {
    this.channelsOpened = !this.channelsOpened;
  }

  openCreateChannels(): void {
    this.sideNavService.createChannelsDivOpened =
      !this.sideNavService.createChannelsDivOpened;
  }

  closeContactDiv(): void {
    this.sideNavService.contactsOpened = !this.sideNavService.contactsOpened;
  }
}
