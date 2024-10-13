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
  // unsubChannels!: Unsubscribe;
  unsubThread!: Unsubscribe;
  private messagesSignal = signal<Message[]>([]);
  readonly messages = this.messagesSignal.asReadonly();
  private threadSignal = signal<Message[]>([]);
  readonly thread = this.threadSignal.asReadonly();
  public channelId = environment.testChannelId;
  public threadId: string = '';

  // channels: Channel[] = [];

  constructor() { 
    this.unsubMessages = this.subMessages(this.channelId);
    // this.unsubChannels = this.subChannels();
    if (this.threadId !== '') {
      this.unsubThread = this.subThread(this.threadId);
    }
  }

  ngOnDestroy() {
    this.unsubMessages();
    // this.unsubChannels();
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

  getDocRef(docId: string, collectionName: string) {
    return doc(this.getCollectionRef(collectionName), docId);
  }

  getDocRefInSubcollection(docId1: string, collectionName: string, subcollectionName: string, docId2: string) {
    return doc(this.firestore, collectionName, docId1, subcollectionName, docId2);
  }

  getCollectionRef(collectionName: string) {
    return collection(this.firestore, collectionName);
  }

  getSubcollectionRef(docId: string, collectionName: string, subcollectionName: string) {
    return collection(this.getDocRef(docId, collectionName), subcollectionName);
  }

  async addMessage(docId: string, collectionName: string, messageObj: MessageInterface) {
    await addDoc(this.getSubcollectionRef(docId, collectionName, 'messages'), messageObj);
  }

  async addThread() {
    let threadId: string = '';
    await addDoc(this.getCollectionRef('threads'), {}).catch(err => {
      console.log(err);
    }).then((docRef) => {
      if (docRef) {
        threadId = docRef.id;
      }
    })
    return threadId;
  }

  clearThread() {
    this.threadSignal.set([]);
  }

  async addThreadMessage(docId: string, collectionName: string, messageObj: MessageInterface) {
    if (docId !== '') {
      console.log('adding message to thread ', docId);
      await this.addMessage(docId, collectionName, messageObj);
      return '';
    } else {
      const threadId = await this.addThread();
      console.log('threadId from firebaseService.addThread()', threadId);
      if (threadId) {
        await this.addMessage(threadId, collectionName, messageObj);
      }
      return threadId;
    }
  }

  async updateMessage(channelOrThreadId: string, collectionName: string, messageId: string, messageObj: any) {
    // {...messageObj} must be used due to a bug concerning the database
    await updateDoc(this.getDocRefInSubcollection(channelOrThreadId, collectionName, 'messages', messageId), {...messageObj});
  }

  subMessages(channelId: string) {
    const q = query(this.getSubcollectionRef(channelId, 'channels', 'messages'), orderBy('postedAt'));
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
    });
  }

  subThread(threadId: string) {
    const q = query(this.getSubcollectionRef(threadId, 'threads', 'messages'), orderBy('postedAt'));
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

  // subChannels() {
  //   return onSnapshot(this.getCollectionRef('channels'), (collection) => {
  //     collection.forEach(doc => {
  //       const data = doc.data();
  //       const userIds = JSON.parse(data['userIds']);
  //       const channel = new Channel(doc.id, data['name'], data['description'], userIds);
  //     })
  //   })
  // }

  changeThread(threadId: string) {
    if (this.unsubThread) {
      this.unsubThread();
    }
    this.threadId = threadId;
    this.unsubThread = this.subThread(threadId);
  }
}
