import { Component } from '@angular/core';
import { MessageTextareaComponent } from '../../message-textarea/message-textarea.component';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [MessageTextareaComponent],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {

}
