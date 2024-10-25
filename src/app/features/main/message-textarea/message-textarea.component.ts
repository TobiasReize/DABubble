import { Component, ElementRef, Input, Renderer2, Signal, ViewChild, ViewContainerRef } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';
import { FormsModule } from '@angular/forms';
import { AtComponent } from './at/at.component';
import { ChatUser } from '../../../core/models/user.class';
import { MentionComponent } from './mention/mention.component';

@Component({
  selector: 'app-message-textarea',
  standalone: true,
  imports: [AtComponent, FormsModule],
  templateUrl: './message-textarea.component.html',
  styleUrl: './message-textarea.component.scss'
})
export class MessageTextareaComponent {
  @Input() placeholder: string = 'Nachricht an #';
  @Input() type: string = 'chat';
  messageText = '';
  isAtVisible: Signal<boolean> = this.chatService.opentAt;
  @ViewChild('mentionInsertion', { read: ViewContainerRef }) mentionInsertion!: ViewContainerRef;

  constructor(private chatService: ChatService, private renderer: Renderer2) { }

  addMessage() {
    if (this.messageText.length > 0) {
      if (this.type === 'chat') {
        this.chatService.addChatMessage(this.messageText);
      } else if (this.type === 'thread') {
        this.chatService.addThreadReply(this.messageText);
      }
      this.messageText = '';
    }
  }

  toggleAtVisibility() {
    this.chatService.toggleAtVisibility();
  }

  addMention(user: ChatUser) {
    console.log(user.name);
    const userName: string = user.name;
    const mention = this.mentionInsertion.createComponent(MentionComponent);
    mention.instance.userName = userName;
  }

}
