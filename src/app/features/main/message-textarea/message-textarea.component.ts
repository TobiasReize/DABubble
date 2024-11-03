import { Component, ComponentRef, ElementRef, Input, Renderer2, SecurityContext, Signal, ViewChild, ViewContainerRef } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AtComponent } from './at/at.component';
import { ChatUser } from '../../../core/models/user.class';
import { MentionComponent } from './mention/mention.component';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { FirebaseService } from '../../../core/services/firebase/firebase.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Channel } from '../../../core/models/channel.class';
import { user } from '@angular/fire/auth';
import { ChannelMentionComponent } from './channel-mention/channel-mention.component';

@Component({
  selector: 'app-message-textarea',
  standalone: true,
  imports: [AtComponent, EmojiPickerComponent, FormsModule, CommonModule],
  templateUrl: './message-textarea.component.html',
  styleUrl: './message-textarea.component.scss'
})
export class MessageTextareaComponent {
  @Input() placeholder: string = 'Nachricht an #';
  @Input() type: string = 'chat';
  @Input() messagesContainerRef!: HTMLDivElement;
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
  fileName: string = '';
  fileType: string = '';
  users: Signal<ChatUser[]> = this.chatService.usersInCurrentChannelWithoutCurrentUser;
  channels: Signal<Channel[]> = this.chatService.channels;
  usersOrChannels: Signal<ChatUser[]> | Signal<Channel[]> = this.users;

  constructor(private chatService: ChatService, private firebaseService: FirebaseService, private renderer: Renderer2, private scroller: ViewportScroller) { }

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
      setTimeout(() => {
        this.scrollToBottom();
      }, 1);
    }
  }

  resetUploadData() {
    this.uploadInfo = '';
    this.uploadFile = null;
    this.uploadError = false;
    this.fileUrl = '';
    this.fileName = '';
    this.fileType = '';
  }

  resetInput() {
    this.resetUploadData();
    this.fileInput.nativeElement.value = null;
  }

  deleteFile() {
    this.firebaseService.deleteFile(this.fileUrl);
    this.resetInput();
  }

  handleInputClick(event: Event) {
    if (this.uploadFile === 'done') {
      this.deleteFile();
      event?.preventDefault();
    } else if (this.uploadFile === 'inProgress') {
      event?.preventDefault();
    }
  }

  keys = {
    shift: false,
    enter: false
  }

  handleTextAreaKeyDown(event: KeyboardEvent) {
    if (event.key === '@') {
      this.usersOrChannels = this.users;
      if (!this.isAtVisible()) {
        this.toggleAtVisibility();
      }
    } else if (event.key === '#') {
      this.usersOrChannels = this.channels;
      if (!this.isAtVisible()) {
        this.toggleAtVisibility();
      }
    } else if (event.key === 'Enter') {
      this.keys.enter = true;
    } else if (event.key === 'Shift') {
      this.keys.shift = true;
    }
    if (this.keys.enter && !this.keys.shift) {
      event.preventDefault();
      this.addMessage();
    }
  }

  handleTextAreaKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.keys.enter = false;
    } else if (event.key === 'Shift') {
      this.keys.shift = false;
    }
  }

  toggleUserVisibility() {
    this.usersOrChannels = this.users;
    this.toggleAtVisibility();
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

  addMention(userOrChannel: ChatUser | Channel) {
    let sel = window.getSelection();
    sel?.modify('move', 'backward', 'character');
    sel?.modify('extend', 'forward', 'character');
    const selString = sel?.toString();
    if (selString === '@' || selString === '#') {
      sel?.deleteFromDocument();
    }
    this.removeBrTag();
    let mention!: ComponentRef<MentionComponent> | ComponentRef<ChannelMentionComponent>;
    if (userOrChannel instanceof ChatUser) {
      mention = this.mentionInsertion.createComponent(MentionComponent);
      mention.instance.user = userOrChannel;
    } else {
      mention = this.mentionInsertion.createComponent(ChannelMentionComponent);
      mention.instance.channel = userOrChannel;
    }
    this.renderer.appendChild(this.editableTextarea.nativeElement, mention.location.nativeElement);
    this.setRangeToEnd();
  }

  setRangeToEnd() {
    this.editableTextarea.nativeElement.focus()
    window.getSelection()?.selectAllChildren(this.editableTextarea.nativeElement);
    window.getSelection()?.collapseToEnd();
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
      this.fileName = file.name;
      switch (true) {
        case (!this.isImage(file.type) && file.type != 'application/pdf'):
          this.handleUploadError('type');
          break;
        case file.size >= 500000:
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
      const path = `channels/${this.chatService.currentChannel().id}/${self.crypto.randomUUID()}/${file.name}`;
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
      this.uploadInfo = 'Datei zu groß! Dateigröße < 500kB';
    } else if (info == 'type') {
      this.uploadInfo = 'Kein gültiger Dateityp! Bitte JPEG, PNG, SVG, WEBP oder PDF auswählen';
    } else {
      this.uploadInfo = 'Es ist ein Fehler aufgetreten! Bitte erneut versuchen.';
    }
    console.log(this.uploadInfo);
  }

  scrollToBottom() {
    if (this.messagesContainerRef) {
      this.messagesContainerRef.scrollTo({
        top: this.messagesContainerRef.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  getFileName(fileUrl: string) {
    return fileUrl.split('/').pop();
  }
}
