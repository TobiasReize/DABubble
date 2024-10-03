import { Component } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { Message } from '../../models/message.class';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  messages: Message[] = [
    new Message('avatar4.svg', 'Maria Musterfrau', 1, '00:00', '00:00', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi odio quia distinctio, a rem tenetur nihil iste saepe voluptates.'),
    new Message(),
    new Message(),
    new Message()
  ];
  channelName: string = 'Entwicklerteam';
}
