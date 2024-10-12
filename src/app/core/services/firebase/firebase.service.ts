import { Injectable, inject } from '@angular/core';
import { MessageInterface } from '../../models/message.interface';
import { addDoc, collection, doc, Firestore, onSnapshot, QueryDocumentSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { Message } from '../../models/message.class';
import { Channel } from '../../models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  firestore: Firestore = inject(Firestore);
  unsubMessages!: Unsubscribe;
  unsubChannels!: Unsubscribe;
  messages: Message[] = [];
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
    console.log(message);
  }

  getDocRef(docId: string, collectionName: string) {
    return doc(this.getCollectionRef(collectionName), docId);
  }

  getCollectionRef(collectionName: string) {
    return collection(this.firestore, collectionName);
  }

  async addMessage(messageObj: MessageInterface) {
    addDoc(this.getCollectionRef('messages'), messageObj);
  }

  subMessages() {
    return onSnapshot(this.getCollectionRef('messages'), (collection) => {
      collection.forEach(doc => {
        this.createMessage(doc);
        collection.docChanges().forEach(change => {
          const data = change.doc.data()
          console.log(data);
        })
      })
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
