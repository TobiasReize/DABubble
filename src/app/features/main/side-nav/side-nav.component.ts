import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

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

  openChannels() {
    this.channelsOpened = !this.channelsOpened;
  }
}
