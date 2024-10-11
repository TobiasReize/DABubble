import { Injectable, signal } from '@angular/core';
import { Message } from '../../models/message.class';
import { Reaction } from '../../models/reaction.class';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private dummyChatMessages: Message[] = [
    new Message('avatar4.svg', 'Maria Musterfrau', new Date('2024-10-03'), new Date('2024-10-03'), 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', [new Reaction()], [new Message()]),
    new Message(),
    new Message(),
    new Message('avatar4.svg', 'Maria Musterfrau', new Date('2024-10-03'), new Date('2024-10-03'), 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', [new Reaction('2705.svg', ['Max Mustermann'])], [new Message(), new Message]),
    new Message(),
    new Message()
  ];

  private defaultEmojis: string[] = ['2705.svg', '1f64c.svg'];

  private chatMessagesSignal = signal<Message[]>(this.dummyChatMessages);
  readonly chatMessages = this.chatMessagesSignal.asReadonly();

  private threadMessageSignal = signal<Message>(new Message());
  readonly threadMessage = this.threadMessageSignal.asReadonly();

  private openThreadSignal = signal<boolean>(false);
  readonly openThread = this.openThreadSignal.asReadonly();

  private lastEmojisSignal = signal<string[]>(this.defaultEmojis);
  readonly lastEmojis = this.lastEmojisSignal.asReadonly();

  changeThreadVisibility(bool: boolean) {
    this.openThreadSignal.set(bool);
  }

  changeThread(message: Message) {
    this.threadMessageSignal.set(message);
  }

  addChatMessage(message: Message) {
    this.chatMessagesSignal.update(values => [...values, message]);
  }

  saveLastEmoji(emoji: string) {
    this.lastEmojisSignal.update(values => [values[1], emoji]);
  }

}
