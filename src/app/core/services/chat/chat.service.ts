import { Injectable, signal } from '@angular/core';
import { Message } from '../../models/message.class';
import { Reaction } from '../../models/reaction.class';
import { MessageInterface } from '../../models/message.interface';
import {
  addDoc,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Unsubscribe,
  updateDoc,
} from '@angular/fire/firestore';
import { FirebaseService } from '../firebase/firebase.service';
import { Channel } from '../../models/channel.class';
import { ChannelName } from '../../models/channel-name.interface';
import { ChannelDescription } from '../../models/channel-description.interface';
import { UserService } from '../user/user.service';
import { ChannelUserIdsInterface } from '../../models/channel-user-ids.interface';
import { User } from '../../models/user.class';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chat: boolean = true;
  contacts = [0, 1, 2, 3, 4, 5];
  names = [
    'Frederik Beck (Du)',
    'Sofia Müller',
    'Noah Braun',
    'Elise Roth',
    'Elias Neumann',
    'Steffen Hoffmann',
  ];
  contactIndex: any = null;
  newMessage: boolean = false;
  directMessage: boolean = false;
  profileViewUsersActive: boolean = false;
  profileActive: string = 'Aktiv';
  profileOffline: string = 'abwesend';

  unsubMessages!: Unsubscribe;
  unsubChannels!: Unsubscribe;
  unsubThread!: Unsubscribe;

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

  private currentChannelSignal = signal<Channel>(new Channel());
  readonly currentChannel = this.currentChannelSignal.asReadonly();

  private openEditChannelSignal = signal<boolean>(false);
  readonly openEditChannel = this.openEditChannelSignal.asReadonly();

  private openAddPeopleSignal = signal<boolean>(false);
  readonly openAddPeople = this.openAddPeopleSignal.asReadonly();

  private openMembersSignal = signal<boolean>(false);
  readonly openMembers = this.openMembersSignal.asReadonly();

  private usersInCurrentChannelSignal = signal<User[]>([]);
  readonly usersInCurrentChannel = this.usersInCurrentChannelSignal.asReadonly();

  public currentThreadId: string = '';

  private channelsSignal = signal<Channel[]>([]);
  readonly channels = this.channelsSignal.asReadonly();

  constructor(private firebaseService: FirebaseService, private userService: UserService) {
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
    const message = new Message(
      doc.id,
      data['imageName'],
      data['userName'],
      postedAt,
      lastReplyAt,
      data['content'],
      reactions,
      data['threadId'],
      data['numberOfReplies']
    );
    return message;
  }

  async addThread() {
    let threadId: string = '';
    await addDoc(this.firebaseService.getCollectionRef('threads'), {})
      .catch((err) => {
        console.log(err);
      })
      .then((docRef) => {
        if (docRef) {
          threadId = docRef.id;
        }
      });
    return threadId;
  }

  clearThread() {
    this.threadRepliesSignal.set([]);
  }

  async addThreadMessage(
    docId: string,
    collectionName: string,
    messageObj: MessageInterface
  ) {
    if (docId !== '') {
      await addDoc(
        this.firebaseService.getSubcollectionRef(
          docId,
          collectionName,
          'messages'
        ),
        messageObj
      );
      return '';
    } else {
      const threadId = await this.addThread();
      if (threadId) {
        await addDoc(
          this.firebaseService.getSubcollectionRef(
            threadId,
            collectionName,
            'messages'
          ),
          messageObj
        );
      }
      return threadId;
    }
  }

  async updateChannel(channelObj: ChannelName | ChannelDescription | ChannelUserIdsInterface) {
    // {...channelObj} must be used due to a bug concerning the database
    await updateDoc(this.firebaseService.getDocRef(this.currentChannel().id, 'channels'), {...channelObj});
  }

  async updateMessage(
    channelOrThreadId: string,
    collectionName: string,
    messageId: string,
    messageObj: any
  ) {
    // {...messageObj} must be used due to a bug concerning the database
    await updateDoc(
      this.firebaseService.getDocRefInSubcollection(
        channelOrThreadId,
        collectionName,
        'messages',
        messageId
      ),
      { ...messageObj }
    );
  }

  async updateThreadMessage() {
    await this.updateMessage(
      this.currentChannel().id,
      'channels',
      this.threadMessage().id,
      this.threadMessage().toJson()
    );
  }

  subMessages(channelId: string) {
    const q = query(
      this.firebaseService.getSubcollectionRef(
        channelId,
        'channels',
        'messages'
      ),
      orderBy('postedAt')
    );
    return onSnapshot(q, (snapshot) => {
      const tempMessages: Message[] = [];
      snapshot.forEach((doc) => {
        const message = this.createMessage(doc);
        if (message) {
          tempMessages.push(message);
        }
      });
      this.messagesSignal.set(tempMessages);
    });
  }

  subThread(threadId: string) {
    const q = query(
      this.firebaseService.getSubcollectionRef(threadId, 'threads', 'messages'),
      orderBy('postedAt')
    );
    return onSnapshot(q, (snapshot) => {
      const tempMessages: Message[] = [];
      snapshot.forEach((doc) => {
        const message = this.createMessage(doc);
        if (message) {
          tempMessages.push(message);
        }
      });
      this.threadRepliesSignal.set(tempMessages);
    });
  }

  createChannel(doc: QueryDocumentSnapshot) {
    const data = doc.data();
    const channel = new Channel(
      doc.id,
      data['name'],
      data['description'],
      data['userIds'],
      data['createdBy']
    );
    return channel;
  }

  subChannels() {
    return onSnapshot(
      this.firebaseService.getCollectionRef('channels'),
      (collection) => {
        const channels: Channel[] = [];
        collection.forEach((doc) => {
          const channel = this.createChannel(doc);
          channels.push(channel);
        });
        this.channelsSignal.set(channels);
        if (!this.unsubMessages) {
          this.currentChannelSignal.set(this.channels()[0]);
          this.unsubMessages = this.subMessages(this.currentChannel().id);
        } else {
          this.changeChannel(this.currentChannel().id);
        }
        this.getUsersInCurrentChannel();
        console.log(this.channels());
      }
    );
  }

  changeThreadVisibility(bool: boolean) {
    this.openThreadSignal.set(bool);
  }

  toggleEditChannelVisibility() {
    this.openEditChannelSignal.set(!this.openEditChannelSignal());
    this.openAddPeopleSignal.set(false);
    this.openMembersSignal.set(false);
  }

  toggleAddPeopleVisibility() {
    this.openAddPeopleSignal.set(!this.openAddPeopleSignal());
    this.openMembersSignal.set(false);
  }

  toggleMembersVisibility() {
    this.openMembersSignal.set(!this.openMembersSignal());
    this.openAddPeopleSignal.set(false);
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

  resubChannel() {
    if (this.unsubMessages) {
      this.unsubMessages();
    }
    this.unsubMessages = this.subMessages(this.currentChannel().id);
  }

  changeChannel(id: string) {
    const index = this.channels().findIndex((channel) => channel.id === id);
    if (index !== -1) {
      this.currentChannelSignal.set(this.channels()[index]);
      this.resubChannel();
    }
  }

  leaveChannel() {
    if (this.currentChannel().userIds && this.currentChannel().userIds.length > 0) {
      const newUserIds = this.currentChannel().userIds.filter(userId => userId !== this.userService.currentOnlineUser.userUID);
      this.updateChannel({
        userIds: newUserIds
      })
    }
  }

  getUsersInCurrentChannel() {
    const foundUsers: User[] = [];
    if (this.currentChannel().userIds && this.currentChannel().userIds.length > 0) {
      this.currentChannel().userIds.forEach(userId => {
        const foundUser = this.userService.allUsers.find(user => userId === user.userUID);
        if (foundUser) {
          foundUsers.push(foundUser);
        }
      })
    }
    this.usersInCurrentChannelSignal.set(foundUsers);
  }

  async addPersonToCurrentChannel(userUID: string) {
    await this.updateChannel({
      userIds: [...this.currentChannel().userIds, userUID]
    })
  }

  findUsers(name: string) {
    const users = this.userService.allUsers.filter(user => user.name.includes(name));
    return users;
  }

  async increaseNumberOfReplies() {
    this.threadMessage().numberOfReplies++;
    this.threadMessage().lastReplyAt = new Date();
    await this.updateThreadMessage();
  }

  async addMessage(messageContent: string, type: 'thread' | 'chat') {
    const message = new Message(
      '',
      this.userService.currentOnlineUser.avatar,
      this.userService.currentOnlineUser.name,
      new Date(),
      new Date(),
      messageContent,
      [],
      '',
      0
    );
    const messageAsJson: MessageInterface = message.toJson();
    if (type === 'chat') {
      await addDoc(
        this.firebaseService.getSubcollectionRef(
          this.currentChannel().id,
          'channels',
          'messages'
        ),
        messageAsJson
      );
    } else {
      const threadId = await this.addThreadMessage(
        this.currentThreadId,
        'threads',
        messageAsJson
      );
      await this.increaseNumberOfReplies();
      if (threadId !== '') {
        await this.updateMessage(
          this.currentChannel().id,
          'channels',
          this.threadMessage().id,
          {
            threadId: threadId,
          }
        );
        this.currentThreadId = threadId;
        this.resubThread(threadId);
      }
    }
  }

  saveLastEmoji(emoji: string) {
    const emojis = this.lastEmojis();
    if (!emojis.includes(emoji)) {
      this.lastEmojisSignal.update((values) => [emoji, values[0]]);
    }
  }

  openChat(index: number): void {
    this.newMessage = false;
    this.chat = false;
    this.directMessage = true;
    this.contactIndex = index;
  }
}
