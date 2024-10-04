import { Component, EventEmitter, Output } from '@angular/core';
import { Message } from '../../models/message.class';
import { MessageComponent } from '../message/message.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [MessageComponent, CommonModule],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  public hidden: boolean = false;
  @Output() hide = new EventEmitter<boolean>();
  emitClose() {
    this.hide.emit(true);
  }
  channelName: string = 'Entwicklerteam';
  messages: Message[] = [
    new Message('avatar4.svg', 'Maria Musterfrau', 1, '00:00', '00:00', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi odio quia distinctio, a rem tenetur nihil iste saepe voluptates.'),
    new Message(),
    new Message(),
    new Message()
  ];
}
