import { Injectable, signal } from '@angular/core';
import { Message } from '../../models/message.class';
import { Reaction } from '../../models/reaction.class';
import { FirebaseService } from '../firebase/firebase.service';
import { MessageInterface } from '../../models/message.interface';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private userName: string = 'Maria Musterfrau';
  private userAvatar: string = 'avatar4.svg';
  private defaultEmojis: string[] = ['2705.svg', '1f64c.svg'];

  private currentChannel: string = this.firebaseService.channelId;
  private currentThread: string = this.firebaseService.threadId;
  
  readonly chatMessages = this.firebaseService.messages;
  readonly threadReplies = this.firebaseService.thread;

  private threadMessageSignal = signal<Message>(new Message());
  readonly threadMessage = this.threadMessageSignal.asReadonly();

  private openThreadSignal = signal<boolean>(false);
  readonly openThread = this.openThreadSignal.asReadonly();

  private lastEmojisSignal = signal<string[]>(this.defaultEmojis);
  readonly lastEmojis = this.lastEmojisSignal.asReadonly();

  constructor(private firebaseService: FirebaseService) {}

  changeThreadVisibility(bool: boolean) {
    this.openThreadSignal.set(bool);
  }

  changeThread(message: Message) {
    const threadId = message.threadId;
    this.threadMessageSignal.set(message);
    if (threadId !== '') {
      this.currentThread = threadId;
      this.firebaseService.changeThread(threadId);
    }
  }

  async addMessage(messageContent: string, type: 'thread' | 'chat') {
    const message = new Message('', this.userAvatar, this.userName, new Date(), new Date(), messageContent, [new Reaction(), new Reaction()], '');
    const messageAsJson: MessageInterface = message.toJson();
    if (type === 'chat') {
      await this.firebaseService.addMessage(this.currentChannel, 'channels', messageAsJson);
    } else {
      const threadId = await this.firebaseService.addThreadMessage(this.currentThread, 'threads', messageAsJson);
      console.log('returned threadId', threadId);
      if (threadId) {
        await this.firebaseService.updateMessage(this.firebaseService.channelId, 'channels', this.threadMessage().id, {
          threadId: threadId
        });
      }
    }
  }

  saveLastEmoji(emoji: string) {
    this.lastEmojisSignal.update(values => [values[1], emoji]);
  }

}
