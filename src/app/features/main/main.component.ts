import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChatService } from '../../core/services/chat/chat.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { ChatComponent } from './chat/chat.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ThreadComponent } from './thread/thread.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, SideNavComponent, ChatComponent, CommonModule, ThreadComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy {
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
