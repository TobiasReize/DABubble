import { Injectable, signal } from '@angular/core';
import { Message } from '../../models/message.class';
import { MessageInterface } from '../../models/message.interface';
import {
  addDoc,
  DocumentSnapshot,
  collection,
  getDocs,
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
  contactIndex: any = null;
  newMessage: boolean = false;
  directMessage: boolean = false;
  profileViewUsersActive: boolean = false;

  unsubMessages!: Unsubscribe;
  unsubChannels!: Unsubscribe;
  unsubThread!: Unsubscribe;
  unsubTopThreadMessage!: Unsubscribe;

  private defaultEmojis: string[] = ['2705.svg', '1f64c.svg'];

  private messagesSignal = signal<Message[]>([]);
  readonly messages = this.messagesSignal.asReadonly();

  private openThreadSignal = signal<boolean>(false);
  readonly openThread = this.openThreadSignal.asReadonly();

  private topThreadMessageSignal = signal<Message>(new Message());
  readonly topThreadMessage = this.topThreadMessageSignal.asReadonly();

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
  readonly usersInCurrentChannel =
    this.usersInCurrentChannelSignal.asReadonly();

  private channelsSignal = signal<Channel[]>([]);
  readonly channels = this.channelsSignal.asReadonly();

  topThreadMessageId: string = '';

  profileViewLoggedUser: boolean = false;
  myChatDescription: boolean = false;
  chatDescription: boolean = false;
  customProfile: boolean = false;
  contacts: any = [];
  currentUser: string = "";
  currentUserStatus: string = "";
  currentUsersEmail: string = "";

  constructor(
    private firebaseService: FirebaseService,
    private userService: UserService
  ) {
    this.unsubChannels = this.subChannels();
    this.unsubThread = this.subThread();
  }

  ngOnDestroy() {
    this.unsubMessages();
    this.unsubChannels();
    if (this.unsubThread) {
      this.unsubThread();
    }
    if (this.unsubTopThreadMessage) {
      this.unsubTopThreadMessage();
    }
  }

  createMessage(doc: QueryDocumentSnapshot | DocumentSnapshot) {
    const data = doc.data();
    if (data) {
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
        data['numberOfReplies']
      );
      return message;
    } else {
      return undefined;
    }
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

  async addChatMessage(messageContent: string) {
    const messageAsJson = this.prepareMessageForDatabase(messageContent);
    await addDoc(
      this.firebaseService.getSubcollectionRef(
        this.currentChannel().id,
        'channels',
        'messages'
      ),
      messageAsJson
    );
  }

  async addThreadReply(messageContent: string) {
      const messageAsJson = this.prepareMessageForDatabase(messageContent);
      await addDoc(
        this.firebaseService.getSubSubcollectionRef(
          'channels',
          this.currentChannel().id,
          'messages',
          this.topThreadMessage().id,
          'thread'
        ),
        messageAsJson
      );
      await this.increaseNumberOfReplies();
  }

  async updateChannel(
    channelObj: ChannelName | ChannelDescription | ChannelUserIdsInterface
  ) {
    // {...channelObj} must be used due to a bug concerning the database
    await updateDoc(
      this.firebaseService.getDocRef(this.currentChannel().id, 'channels'),
      { ...channelObj }
    );
  }

  async updateChatMessage(messageId: string, messageObj: any) {
    // {...messageObj} must be used due to a bug concerning the database
    await updateDoc(
      this.firebaseService.getDocRefInSubcollection(
        this.currentChannel().id,
        'channels',
        'messages',
        messageId
      ),
      { ...messageObj }
    );
  }

  async updateThreadReply(replyId: string, messageObj: MessageInterface) {
    await updateDoc(
      this.firebaseService.getDocRefInSubSubcollection(
        'channels',
        this.currentChannel().id,
        'messages',
        this.topThreadMessage().id,
        'thread',
        replyId
      ),
      { ...messageObj }
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

  resubThread() {
    if (this.unsubThread) {
      this.unsubThread();
    }
    this.unsubThread = this.subThread();
  }

  changeThread(message: Message) {
    this.topThreadMessageId = message.id;
    this.resubThread();
    this.unsubTopThreadMessage = this.subTopThreadMessage();
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
    let users = this.userService.allUsers.filter(user => user.name.includes(name));
    users = users.filter(user => user.userUID !== this.userService.currentOnlineUser.userUID);
    return users;
  }

  async increaseNumberOfReplies() {
    this.topThreadMessage().numberOfReplies++;
    this.topThreadMessage().lastReplyAt = new Date();
    this.updateChatMessage(this.topThreadMessage().id, this.topThreadMessage().toJson());
  }

  prepareMessageForDatabase(messageContent: string): MessageInterface {
    const message = new Message(
      '',
      this.userService.currentOnlineUser.avatar,
      this.userService.currentOnlineUser.name,
      new Date(),
      new Date(),
      messageContent,
      [],
      0
    );
    return message.toJson();
  }

  saveLastEmoji(emoji: string) {
    const emojis = this.lastEmojis();
    if (!emojis.includes(emoji)) {
      this.lastEmojisSignal.update((values) => [emoji, values[0]]);
    }
  }

  openChat(id: number, vorname: string, nachname: string, status: string, email: string): void {
    this.newMessage = false;
    this.chat = false;
    this.directMessage = true;
    this.contactIndex = id;
    this.currentUser = vorname + " " + nachname;
    this.currentUserStatus = status;
    this.currentUsersEmail = email;
    if (this.currentUser.includes('(Du)')) {
      this.myChatDescription = true;
      this.chatDescription = false;
    } else {
      this.myChatDescription = false;
      this.chatDescription = true;
    }
    console.log('index:', this.contactIndex);
  }

  async getContacts() {
    const q = query(collection(this.firebaseService.firestore, 'contacts'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      this.contacts.push(doc);
    });
  }

  subThread() {
    const q = query(
      this.firebaseService.getSubSubcollectionRef('channels', this.currentChannel().id, 'messages', this.topThreadMessageId, 'thread'),
      orderBy('postedAt')
    );
    return onSnapshot(q, (snapshot) => {
      const tempMessages: any[] = [];
      snapshot.forEach((doc) => {
        const message = this.createMessage(doc);
        if (message) {
          tempMessages.push(message);
        }
      });
      this.threadRepliesSignal.set(tempMessages);
    });
  }

  subTopThreadMessage() {
    return onSnapshot(this.firebaseService.getDocRefInSubcollection(this.currentChannel().id, 'channels', 'messages', this.topThreadMessageId), (doc) => {
      if (doc) {
          const message = this.createMessage(doc);
          if (message) {
            this.topThreadMessageSignal.set(message);
          }
        }
    });
  }
}
