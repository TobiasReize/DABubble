import { Component, ElementRef, Input, Renderer2, SecurityContext, Signal, ViewChild, ViewContainerRef } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';
import { FormsModule } from '@angular/forms';
import { AtComponent } from './at/at.component';
import { ChatUser } from '../../../core/models/user.class';
import { MentionComponent } from './mention/mention.component';
import { EmojiPickerComponent } from './emoji-picker/emoji-picker.component';

@Component({
  selector: 'app-message-textarea',
  standalone: true,
  imports: [AtComponent, EmojiPickerComponent, FormsModule],
  templateUrl: './message-textarea.component.html',
  styleUrl: './message-textarea.component.scss'
})
export class MessageTextareaComponent {
  @Input() placeholder: string = 'Nachricht an #';
  @Input() type: string = 'chat';
  messageText = '';
  isAtVisible: Signal<boolean> = this.chatService.opentAt;
  isEmojiPickerVisible: Signal<boolean> = this.chatService.openEmojiPicker;
  @ViewChild('editableTextarea') editableTextarea!: ElementRef
  @ViewChild('mentionInsertion', { read: ViewContainerRef }) mentionInsertion!: ViewContainerRef;

  constructor(private chatService: ChatService, private renderer: Renderer2) { }

  addMessage() {
    this.saveMessageText();
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

  toggleEmojiPickerVisibility() {
    this.chatService.toggleEmojiPickerVisibility();
  }

  addMention(user: ChatUser) {
    if (this.editableTextarea.nativeElement.textContent == '') {
      const child = this.editableTextarea.nativeElement.firstElementChild;
      if (child && child.tagName === 'BR') {
        child.remove();
      }
    }
    const mention = this.mentionInsertion.createComponent(MentionComponent);
    mention.instance.user = user;
    this.renderer.appendChild(this.editableTextarea.nativeElement, mention.location.nativeElement);
  }

  saveMessageText() {
    this.messageText = this.editableTextarea.nativeElement.textContent;
  }

  insertEmoji(emoji: string) {
    this.editableTextarea.nativeElement.innerHTML += emoji;
  }

}
