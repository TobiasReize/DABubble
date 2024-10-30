import { Component, ElementRef, Input, Renderer2, SecurityContext, Signal, ViewChild, ViewContainerRef } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AtComponent } from './at/at.component';
import { ChatUser } from '../../../core/models/user.class';
import { MentionComponent } from './mention/mention.component';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { FirebaseService } from '../../../core/services/firebase/firebase.service';

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
  @ViewChild('editableTextarea') editableTextarea!: ElementRef;
  @ViewChild('mentionInsertion', { read: ViewContainerRef }) mentionInsertion!: ViewContainerRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  uploadInfo: string = '';
  uploadFile: null | 'inProgress' | 'done' = null;
  uploadError: boolean = false;
  fileUrl: string = '';
  fileType: string = '';

  constructor(private chatService: ChatService, private firebaseService: FirebaseService, private renderer: Renderer2) { }

  ngOnInit() {
    if (this.type === 'thread') {
      this.isAtVisible = this.chatService.openAtForThread;
      this.isEmojiPickerVisible = this.chatService.openEmojiPickerForThread;
    }
  }

  addMessage() {
    this.saveMessageText();
    if (this.messageText.length > 0) {
      if (this.type === 'chat') {
        this.chatService.addChatMessage(this.messageText, this.fileUrl, this.fileType);
      } else if (this.type === 'thread') {
        this.chatService.addThreadReply(this.messageText, this.fileUrl, this.fileType);
      }
      this.messageText = '';
      this.editableTextarea.nativeElement.innerHTML = '';
      this.resetInput();
    }
  }

  resetUploadData() {
    this.uploadInfo = '';
    this.uploadFile = null;
    this.uploadError = false;
    this.fileUrl = '';
    this.fileType = '';
  }

  resetInput() {
    this.resetUploadData();
    this.fileInput.nativeElement.value = null;
    console.log('resetting input', this.fileInput.nativeElement.value);
  }

  toggleAtVisibility() {
    if (this.type === 'chat') {
      this.chatService.toggleAtVisibility();
    } else {
      this.chatService.toggleAtForThreadVisibility();
    }
  }

  toggleEmojiPickerVisibility() {
    if (this.type === 'chat') {
      this.chatService.toggleEmojiPickerVisibility();
    } else {
      this.chatService.toggleEmojiPickerForThreadVisibility();
    }
  }

  removeBrTag() {
    if (this.editableTextarea.nativeElement.textContent == '') {
      const child = this.editableTextarea.nativeElement.firstElementChild;
      if (child && child.tagName === 'BR') {
        child.remove();
      }
    }
  }

  addMention(user: ChatUser) {
    this.removeBrTag();
    const mention = this.mentionInsertion.createComponent(MentionComponent);
    mention.instance.user = user;
    this.renderer.appendChild(this.editableTextarea.nativeElement, mention.location.nativeElement);
  }

  saveMessageText() {
    this.messageText = this.editableTextarea.nativeElement.textContent;
  }

  insertEmoji(emoji: string) {
    this.removeBrTag();
    this.editableTextarea.nativeElement.innerHTML += emoji;
  }

  isImage(fileType: string) {
    console.log('image check');
    return fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/svg+xml' || fileType === 'image/webp';
  }

  addFile(input: HTMLInputElement) {
    this.uploadFile = 'inProgress';
    this.uploadError = false;
    this.uploadInfo = '';
    const file = input.files?.item(0);
    if (file) {
      console.log('file', file);
      switch (true) {
        case (!this.isImage(file.type) && file.type != 'application/pdf'):
          this.handleUploadError('type');
          break;
        case file.size >= 1000000:
          this.handleUploadError('size');
          break;
        default:
          this.fileType = file.type;
          this.uploadFileToStorage(file);
      }
    }
  }

  async uploadFileToStorage(file: File) {
    try {
      const path = 'message-images/' + file.name;
      await this.firebaseService.uploadFileToStorage(file, path);
      this.fileUrl = this.firebaseService.downloadURL;
      this.uploadFile = 'done';
    } catch (error) {
      this.handleUploadError('else');
      console.log('Error:', error);
    }
  }

  handleUploadError(info: string) {
    this.uploadError = true;
    this.uploadFile = 'done';
    if (info == 'size') {
      this.uploadInfo = 'Datei zu groß! Dateigröße < 1MB';
    } else if (info == 'type') {
      this.uploadInfo = 'Kein gültiger Dateityp! Bitte JPEG, PNG, SVG, WEBP oder PDF auswählen';
    } else {
      this.uploadInfo = 'Es ist ein Fehler aufgetreten! Bitte erneut versuchen.';
    }
    console.log(this.uploadInfo);
  }

}
