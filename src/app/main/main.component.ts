import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { ChatComponent } from './chat/chat.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ThreadComponent } from './thread/thread.component';
import { CommonModule } from '@angular/common';
import { ChatService } from './services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, SideNavComponent, ChatComponent, ThreadComponent, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  isThreadVisible: boolean = false;
  threadVisibilitySubscription!: Subscription;
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.threadVisibilitySubscription = this.chatService.threadVisibilityListener().subscribe((bool: boolean) => {
      this.isThreadVisible = bool;
    });
  }

  ngOnDestroy() {
    this.threadVisibilitySubscription.unsubscribe();
  }
}
