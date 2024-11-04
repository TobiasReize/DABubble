import { Component, ComponentRef, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase/firebase.service';
import { ChatService } from '../../../core/services/chat/chat.service';

@Component({
  selector: 'app-deletable-file',
  standalone: true,
  imports: [],
  templateUrl: './deletable-file.component.html',
  styleUrl: './deletable-file.component.scss'
})
export class DeletableFileComponent {

  @Input() fileUrl: string = '';
  @Input() fileType: string = '';
  @Input() fileName: string = '';
  @Input() type: string = 'chat';
  @Input() messageId: string = '';
  @Output() deletionEvent = new EventEmitter<string>();

  constructor(private chatService: ChatService, private firebaseService: FirebaseService) {}

  isPdf() {
    return this.fileType === 'application/pdf';
  }

  deleteFile(messageId: string) {
    this.firebaseService.deleteFile(this.fileUrl);
    this.deletionEvent.emit('deletion event');
    const emptyFileData = {
      fileUrl: '',
      fileType: '',
      fileName: ''
    };
    if (messageId) {
      if (this.type === 'chat') {
        this.chatService.updateChatMessage(messageId, emptyFileData);
      } else if (this.type === 'thread') {
        this.chatService.updateThreadReply(messageId, emptyFileData);
      } 
    }
    // else if (this.type === 'directMessage') {
    //   this.chatService.updateDirectMessage(messageId, emptyFileData);
    // }
  }
}
