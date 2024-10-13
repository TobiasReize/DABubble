import { inject, Injectable, signal } from '@angular/core';
import { Message } from '../../models/message.class';
import { Reaction } from '../../models/reaction.class';
import { MessageInterface } from '../../models/message.interface';
import { environment } from '../../../../environments/environment.development';
import { addDoc, Firestore, onSnapshot, orderBy, query, QueryDocumentSnapshot, Unsubscribe, updateDoc } from '@angular/fire/firestore';
import { FirebaseService } from '../firebase/firebase.service';
import { Channel } from '../../models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  firestore: Firestore = inject(Firestore);
  unsubMessages!: Unsubscribe;
  unsubChannels!: Unsubscribe;
  unsubThread!: Unsubscribe;

  private userName: string = 'Maria Musterfrau';
  private userAvatar: string = 'avatar4.svg';
  private defaultEmojis: string[] = ['2705.svg', '1f64c.svg'];

  private messagesSignal = signal<Message[]>([]);
  readonly messages = this.messagesSignal.asReadonly();

  private openThreadSignal = signal<boolean>(false);
  readonly openThread = this.openThreadSignal.asReadonly();

  private threadMessageSignal = signal<Message>(new Message());
  readonly threadMessage = this.threadMessageSignal.asReadonly();

  private threadRepliesSignal = signal<Message[]>([]);
  readonly threadReplies = this.threadRepliesSignal.asReadonly();

  private lastEmojisSignal = signal<string[]>(this.defaultEmojis);
  readonly lastEmojis = this.lastEmojisSignal.asReadonly();
  
  public currentChannelId: string = '';
  public currentThreadId: string = '';

  private channelsSignal = signal<Channel[]>([]);
  readonly channels = this.channelsSignal.asReadonly();

  constructor(private firebaseService: FirebaseService) { 
    this.unsubChannels = this.subChannels();
    if (this.currentThreadId !== '') {
      this.unsubThread = this.subThread(this.currentThreadId);
    }
  }

  ngOnDestroy() {
    this.unsubMessages();
    this.unsubChannels();
    if (this.unsubThread) {
      this.unsubThread();
    }
  }

  createMessage(doc: QueryDocumentSnapshot) {
    const data = doc.data();
    const reactions = JSON.parse(data['reactions']);
    const postedAt = new Date(data['postedAt']);
    const lastReplyAt = new Date(data['lastReplyAt']);
    const message = new Message(doc.id, data['imageName'], data['userName'], postedAt, lastReplyAt, data['content'], reactions, data['threadId']);
    return message;
  }

  async addThread() {
    let threadId: string = '';
    await addDoc(this.firebaseService.getCollectionRef('threads'), {}).catch(err => {
      console.log(err);
    }).then((docRef) => {
      if (docRef) {
        threadId = docRef.id;
      }
    })
    return threadId;
  }

  clearThread() {
    this.threadRepliesSignal.set([]);
  }

  async addThreadMessage(docId: string, collectionName: string, messageObj: MessageInterface) {
    if (docId !== '') {
      await addDoc(this.firebaseService.getSubcollectionRef(docId, collectionName, 'messages'), messageObj);
      return '';
    } else {
      const threadId = await this.addThread();
      if (threadId) {
        await addDoc(this.firebaseService.getSubcollectionRef(threadId, collectionName, 'messages'), messageObj);
      }
      return threadId;
    }
  }

  async updateMessage(channelOrThreadId: string, collectionName: string, messageId: string, messageObj: any) {
    // {...messageObj} must be used due to a bug concerning the database
    await updateDoc(this.firebaseService.getDocRefInSubcollection(channelOrThreadId, collectionName, 'messages', messageId), {...messageObj});
  }

  subMessages(channelId: string) {
    const q = query(this.firebaseService.getSubcollectionRef(channelId, 'channels', 'messages'), orderBy('postedAt'));
    return onSnapshot(q, (snapshot) => {
      const tempMessages: Message[] = [];
      snapshot.forEach(doc => {
        const message = this.createMessage(doc);
        if (message) {
          tempMessages.push(message);
        }
      })
      this.messagesSignal.set(tempMessages);
    });
  }

  subThread(threadId: string) {
    const q = query(this.firebaseService.getSubcollectionRef(threadId, 'threads', 'messages'), orderBy('postedAt'));
    return onSnapshot(q, (snapshot) => {
      const tempMessages: Message[] = [];
      snapshot.forEach(doc => {
        const message = this.createMessage(doc);
        if (message) {
          tempMessages.push(message);
        }
      })
      this.threadRepliesSignal.set(tempMessages);
    });
  }

  subChannels() {
    return onSnapshot(this.firebaseService.getCollectionRef('channels'), (collection) => {
      const channels: Channel[] = [];
      collection.forEach(doc => {
        const data = doc.data();
        const userIds = JSON.parse(data['userIds']);
        const channel = new Channel(doc.id, data['name'], data['description'], userIds);
        channels.push(channel);
      })
      this.channelsSignal.set(channels);
      if (!this.unsubMessages) {
        this.currentChannelId = this.channels()[0].id;
        this.unsubMessages = this.subMessages(this.currentChannelId);
      }
    })
  }

  changeThreadVisibility(bool: boolean) {
    this.openThreadSignal.set(bool);
  }

  resubThread(threadId: string) {
    if (this.unsubThread) {
      this.unsubThread();
    }
    this.unsubThread = this.subThread(threadId);
  }

  changeThread(message: Message) {
    const threadId = message.threadId;
    this.currentThreadId = threadId;
    this.threadMessageSignal.set(message);
    if (threadId !== '') {
      this.resubThread(threadId);
    } else if (threadId === '') {
      this.clearThread();
    }
  }

  async addMessage(messageContent: string, type: 'thread' | 'chat') {
    const message = new Message('', this.userAvatar, this.userName, new Date(), new Date(), messageContent, [new Reaction(), new Reaction()], '');
    const messageAsJson: MessageInterface = message.toJson();
    if (type === 'chat') {
      await addDoc(this.firebaseService.getSubcollectionRef(this.currentChannelId, 'channels', 'messages'), messageAsJson);
    } else {
      const threadId = await this.addThreadMessage(this.currentThreadId, 'threads', messageAsJson);
      if (threadId !== '') {
        await this.updateMessage(this.currentChannelId, 'channels', this.threadMessage().id, {
          threadId: threadId
        });
        this.currentThreadId = threadId;
        this.resubThread(threadId);
      }
    }
  }

  saveLastEmoji(emoji: string) {
    this.lastEmojisSignal.update(values => [values[1], emoji]);
  }

}
