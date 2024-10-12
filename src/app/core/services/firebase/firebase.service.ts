import { Injectable, inject, signal } from '@angular/core';
import { MessageInterface } from '../../models/message.interface';
import { addDoc, collection, doc, Firestore, onSnapshot, orderBy, query, QueryDocumentSnapshot, Unsubscribe, updateDoc } from '@angular/fire/firestore';
import { Message } from '../../models/message.class';
import { Channel } from '../../models/channel.class';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  firestore: Firestore = inject(Firestore);
  unsubMessages!: Unsubscribe;
  unsubChannels!: Unsubscribe;
  unsubThread!: Unsubscribe;
  private messagesSignal = signal<Message[]>([]);
  readonly messages = this.messagesSignal.asReadonly();
  private threadSignal = signal<Message[]>([]);
  readonly thread = this.threadSignal.asReadonly();

  channels: Channel[] = [];

  constructor() { 
    this.unsubMessages = this.subMessages();
    this.unsubChannels = this.subChannels();
    this.unsubThread = this.subThread();
  }

  ngOnDestroy() {
    this.unsubMessages();
    this.unsubChannels();
    this.unsubThread();
  }

  createMessage(doc: QueryDocumentSnapshot) {
    const data = doc.data();
    const reactions = JSON.parse(data['reactions']);
    const postedAt = new Date(data['postedAt']);
    const lastReplyAt = new Date(data['lastReplyAt']);
    const message = new Message(doc.id, data['imageName'], data['userName'], postedAt, lastReplyAt, data['content'], reactions, data['threadId']);
    return message;
  }

  getDocRef(docId: string, collectionName: string) {
    return doc(this.getCollectionRef(collectionName), docId);
  }

  getCollectionRef(collectionName: string) {
    return collection(this.firestore, collectionName);
  }

  getSubcollectionRef(docId: string, collectionName: string, subcollectionName: string) {
    return collection(this.getDocRef(docId, collectionName), subcollectionName);
  }

  async addMessage(messageObj: MessageInterface) {
    await addDoc(this.getCollectionRef('messages'), messageObj);
  }

  async addMessageToChannel(channelId: string, messageObj: MessageInterface) {
    await addDoc(this.getSubcollectionRef(channelId, 'channels', 'messages'), messageObj);
  }

  async updateMessage(docId: string, messageObj: MessageInterface) {
    // {...messageObj} must be used due to a bug concerning the database
    await updateDoc(this.getDocRef(docId, 'messages'), {...messageObj});
  }

  subMessages() {
    const q = query(this.getCollectionRef('messages'), orderBy('postedAt'));
    return onSnapshot(q, (snapshot) => {
      const tempMessages: Message[] = [];
      snapshot.forEach(doc => {
        const message = this.createMessage(doc);
        if (message) {
          console.log(message);
          tempMessages.push(message);
        }
      })
      this.messagesSignal.set(tempMessages);
      console.log('messagesSignal', this.messagesSignal());
    });
  }

  subThread() {
    const q = query(this.getSubcollectionRef(environment.testThreadId, 'channels', 'messages'), orderBy('postedAt'));
    return onSnapshot(q, (snapshot) => {
      const tempMessages: Message[] = [];
      snapshot.forEach(doc => {
        const message = this.createMessage(doc);
        if (message) {
          console.log('subThread message', message);
          tempMessages.push(message);
        }
      })
      this.threadSignal.set(tempMessages);
    });
  }

  subChannels() {
    return onSnapshot(this.getCollectionRef('channels'), (collection) => {
      collection.forEach(doc => {
        const data = doc.data();
        const userIds = JSON.parse(data['userIds']);
        const messageIds = JSON.parse(data['messageIds']);
        const channel = new Channel(doc.id, data['name'], data['description'], userIds, messageIds);
      })
    })
  }
}
