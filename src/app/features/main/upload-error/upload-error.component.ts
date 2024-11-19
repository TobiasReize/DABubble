import { Component, Signal } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';

@Component({
  selector: 'app-upload-error',
  standalone: true,
  imports: [],
  templateUrl: './upload-error.component.html',
  styleUrl: './upload-error.component.scss'
})
export class UploadErrorComponent {

  errorType: Signal<string> = this.chatService.uploadErrorType;

  constructor(private chatService: ChatService) { }

  closeDialog() {
    this.chatService.toggleUploadErrorVisibility();
  }
}
