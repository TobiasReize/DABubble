import { Component, Input } from '@angular/core';
import { Message } from '../../models/message.class';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() messageData: Message = new Message();
  userName: string = 'Maria Musterfrau';
  isMe: boolean = false;

  ngOnInit() {
    this.isMe = this.messageData.userName == this.userName;
  }
}
