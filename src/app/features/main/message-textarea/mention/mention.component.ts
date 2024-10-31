import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChatUser } from '../../../../core/models/user.class';
import { Channel } from '../../../../core/models/channel.class';
import { ChatService } from '../../../../core/services/chat/chat.service';

@Component({
  selector: 'app-mention',
  standalone: true,
  imports: [],
  templateUrl: './mention.component.html',
  styleUrl: './mention.component.scss'
})
export class MentionComponent {
  @Input() userOrChannel!: ChatUser | Channel;
  @ViewChild('mention', { read: ElementRef }) mention!: ElementRef;

  constructor(private chatService: ChatService) { }

  selectMention() {
    const selection = window.getSelection();
    selection?.removeAllRanges();
    const range = document.createRange();
    range.selectNodeContents(this.mention.nativeElement);
    selection?.addRange(range);
  }

  isChatUser(option:  ChatUser | Channel): boolean {
    return this.chatService.isChatUser(option);
  }
}