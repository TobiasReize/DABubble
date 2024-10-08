import { Component, Signal } from '@angular/core';
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
export class MainComponent {
  isThreadVisible: Signal<boolean> = this.chatService.openThread;
  threadVisibilitySubscription!: Subscription;
  constructor(private chatService: ChatService) {}

}
