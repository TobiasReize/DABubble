import { Injectable, inject, signal } from '@angular/core';
import { MessageInterface } from '../../models/message.interface';
import { addDoc, collection, doc, Firestore, onSnapshot, QueryDocumentSnapshot, Unsubscribe, updateDoc } from '@angular/fire/firestore';
import { Message } from '../../models/message.class';
import { Channel } from '../../models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  firestore: Firestore = inject(Firestore);
  unsubMessages!: Unsubscribe;
  unsubChannels!: Unsubscribe;
  private messagesSignal = signal<Message[]>([]);
  readonly messages = this.messagesSignal.asReadonly();
  channels: Channel[] = [];

  constructor() { 
    this.unsubMessages = this.subMessages();
    this.unsubChannels = this.subChannels();
  }

  ngOnDestroy() {
    this.unsubMessages();
    this.unsubChannels();
  }

  createMessage(doc: QueryDocumentSnapshot) {
    const data = doc.data();
    const reactions = JSON.parse(data['reactions']);
    const replyIds = JSON.parse(data['replyIds']);
    const postedAt = new Date(+data['postedAtAsString']);
    const lastReplyAt = new Date(+data['lastReplyAtAsString']);
    const message = new Message(doc.id, data['imageName'], data['userName'], postedAt, lastReplyAt, data['content'], reactions, replyIds);
    return message;
  }

  getDocRef(docId: string, collectionName: string) {
    return doc(this.getCollectionRef(collectionName), docId);
  }

  getCollectionRef(collectionName: string) {
    return collection(this.firestore, collectionName);
  }

  async addMessage(messageObj: MessageInterface) {
    await addDoc(this.getCollectionRef('messages'), messageObj);
  }

  async updateMessage(docId: string, messageObj: MessageInterface) {
    // {...messageObj} must be used due to a bug concerning the database
    await updateDoc(this.getDocRef(docId, 'messages'), {...messageObj});
  }

  subMessages() {
    return onSnapshot(this.getCollectionRef('messages'), (collection) => {
      const tempMessages: Message[] = [];
      collection.forEach(doc => {
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
