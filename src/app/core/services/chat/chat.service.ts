import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
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
import { ChannelUserUIDsInterface } from '../../models/channel-user-uids.interface';
import { ChatUser } from '../../models/user.class';

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

  private openAtSignal = signal<boolean>(false);
  readonly opentAt = this.openAtSignal.asReadonly();

  private openAtForThreadSignal = signal<boolean>(false);
  readonly openAtForThread = this.openAtForThreadSignal.asReadonly();

  private openEmojiPickerSignal = signal<boolean>(false);
  readonly openEmojiPicker = this.openEmojiPickerSignal.asReadonly();

  private openEmojiPickerForThreadSignal = signal<boolean>(false);
  readonly openEmojiPickerForThread = this.openEmojiPickerForThreadSignal.asReadonly();

  private openEmojiPickerForEditingSignal = signal<boolean>(false);
  readonly openEmojiPickerForEditing = this.openEmojiPickerForEditingSignal.asReadonly();

  private usersInCurrentChannelSignal = signal<ChatUser[]>([]);
  readonly usersInCurrentChannel =
    this.usersInCurrentChannelSignal.asReadonly();

  private usersInCurrentChannelWithoutCurrentUserSignal: Signal<ChatUser[]> = computed(() => this.usersInCurrentChannel().filter(user => user.userUID !== this.userService.currentOnlineUser().userUID));
  readonly usersInCurrentChannelWithoutCurrentUser = this.usersInCurrentChannelWithoutCurrentUserSignal;

  private channelsSignal = signal<Channel[]>([]);
  readonly channels = this.channelsSignal.asReadonly();

  topThreadMessageId: string = '';

  profileViewLoggedUser: boolean = false;
  myChatDescription: boolean = false;
  chatDescription: boolean = false;
  customProfile: boolean = false;
  contacts: any = [];

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

  createMessageFromDocumentSnapshot(doc: QueryDocumentSnapshot | DocumentSnapshot) {
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
        data['numberOfReplies'],
        data['fileUrl'],
        data['fileType']
      );
      return message;
    } else {
      return undefined;
    }
  }

  clearThread() {
    this.threadRepliesSignal.set([]);
  }

  async addChatMessage(messageContent: string, fileUrl: string, fileType: string) {
    const messageAsJson = this.prepareMessageForDatabase(messageContent, fileUrl, fileType);
    await addDoc(
      this.firebaseService.getSubcollectionRef(
        this.currentChannel().id,
        'channels',
        'messages'
      ),
      messageAsJson
    );
  }

 async addDirectMessage(messageContent: string, fileUrl: string, fileType: string) {
   const messageAsJson = this.prepareMessageForDatabase(messageContent, fileUrl, fileType);
   await addDoc(
    this.firebaseService.getCollectionRef('directMessages'),
     messageAsJson
   );
 }

  async addThreadReply(messageContent: string, fileUrl: string, fileType: string) {
      const messageAsJson = this.prepareMessageForDatabase(messageContent, fileUrl, fileType);
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
    channelObj: ChannelName | ChannelDescription | ChannelUserUIDsInterface
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

  // async updateDirectMessage(messageId: string, messageObj: any) {
  //   // {...messageObj} must be used due to a bug concerning the database
  //   await updateDoc(
  //     this.firebaseService.getDocRefInSubcollection(
  //       this.currentDirectMessageChannel().id,
  //       'directmessages',
  //       'messages',
  //       messageId
  //     ),
  //     { ...messageObj }
  //   );
  // }

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
        const message = this.createMessageFromDocumentSnapshot(doc);
        if (message) {
          tempMessages.push(message);
        }
      });
      this.messagesSignal.set(tempMessages);
    });
  }

  createChannelFromQueryDocumentSnapshot(doc: QueryDocumentSnapshot) {
    const data = doc.data();
    const channel = new Channel(
      doc.id,
      data['name'],
      data['description'],
      data['userUIDs'],
      data['createdBy']
    );
    console.log(channel);
    return channel;
  }

  subChannels() {
    return onSnapshot(
      this.firebaseService.getCollectionRef('channels'),
      (collection) => {
        const channels: Channel[] = [];
        collection.forEach((doc) => {
          const channel = this.createChannelFromQueryDocumentSnapshot(doc);
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

  toggleVisibilitySignal(visibilitySignal: WritableSignal<boolean>) {
    const visibilitySignals = [this.openAddPeopleSignal, this.openEditChannelSignal, this.openMembersSignal, this.openAtSignal, this.openAtForThreadSignal, this.openEmojiPickerSignal, this.openEmojiPickerForThreadSignal, this.openEmojiPickerForEditingSignal];
    visibilitySignals.forEach(s => s != visibilitySignal ? s.set(false) : null);
    visibilitySignal.set(!visibilitySignal());
  }

  toggleEditChannelVisibility() {
    this.toggleVisibilitySignal(this.openEditChannelSignal);
  }

  toggleAddPeopleVisibility() {
    this.toggleVisibilitySignal(this.openAddPeopleSignal);
  }

  toggleMembersVisibility() {
    this.toggleVisibilitySignal(this.openMembersSignal);
  }

  toggleAtVisibility() {
    this.toggleVisibilitySignal(this.openAtSignal);
  }

  toggleAtForThreadVisibility() {
    this.toggleVisibilitySignal(this.openAtForThreadSignal);
  }

  toggleEmojiPickerVisibility() {
    this.toggleVisibilitySignal(this.openEmojiPickerSignal);
  }

  toggleEmojiPickerForThreadVisibility() {
    this.toggleVisibilitySignal(this.openEmojiPickerForThreadSignal);
  }

  toggleEmojiPickerForEditingVisibility() {
    this.toggleVisibilitySignal(this.openEmojiPickerForEditingSignal);
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
    this.getUsersInCurrentChannel();
  }

  changeChannel(id: string) {
    const index = this.channels().findIndex((channel) => channel.id === id);
    if (index !== -1) {
      this.currentChannelSignal.set(this.channels()[index]);
      this.resubChannel();
    }
  }

  leaveChannel() {
    if (this.currentChannel().userUIDs && this.currentChannel().userUIDs.length > 0) {
      const newuserUIDs = this.currentChannel().userUIDs.filter(userUID => userUID !== this.userService.currentOnlineUser().userUID);
      this.updateChannel({
        userUIDs: newuserUIDs
      })
    }
  }

  getUsersInCurrentChannel() {
    const foundUsers: ChatUser[] = [];
    if (this.currentChannel().userUIDs && this.currentChannel().userUIDs.length > 0) {
      this.currentChannel().userUIDs.forEach(userUID => {
        const foundUser = this.userService.allUsers().find(user => userUID === user.userUID);
        if (foundUser) {
          foundUsers.push(foundUser);
        }
      })
    }
    this.usersInCurrentChannelSignal.set(foundUsers);
  }

  async addPersonToCurrentChannel(userUID: string) {
    if (!this.currentChannel().userUIDs.includes(userUID)) {
      await this.updateChannel({
        userUIDs: [...this.currentChannel().userUIDs, userUID]
      })
    }
  }

  findUserInAllUsers(name: string): ChatUser[] {
    return this.userService.allUsers().filter(user => user.name.toLowerCase().includes(name.toLowerCase()));
  }

  findUsersToAdd(name: string): ChatUser[] {
    const users = this.findUserInAllUsers(name);
    return users.filter(user => !this.usersInCurrentChannel().includes(user));
  }

  async increaseNumberOfReplies() {
    this.topThreadMessage().numberOfReplies++;
    this.topThreadMessage().lastReplyAt = new Date();
    this.updateChatMessage(this.topThreadMessage().id, this.topThreadMessage().toJson());
  }

  prepareMessageForDatabase(messageContent: string, fileUrl: string, fileType: string): MessageInterface {
    const message = new Message(
      '',
      this.userService.currentOnlineUser().avatar,
      this.userService.currentOnlineUser().name,
      new Date(),
      new Date(),
      messageContent,
      [],
      0,
      fileUrl,
      fileType
    );
    return message.toJson();
  }

  saveLastEmoji(emoji: string) {
    const emojis = this.lastEmojis();
    if (!emojis.includes(emoji)) {
      this.lastEmojisSignal.update((values) => [emoji, values[0]]);
    }
  }

  openChat(id: number): void {
    this.newMessage = false;
    this.chat = false;
    this.directMessage = true;
    this.contactIndex = id;
    if (this.userService.allUsers()[this.contactIndex].name === this.userService.currentOnlineUser().name) {
      this.myChatDescription = true;
      this.chatDescription = false;
    } else {
      this.myChatDescription = false;
      this.chatDescription = true;
    }
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
        const message = this.createMessageFromDocumentSnapshot(doc);
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
          const message = this.createMessageFromDocumentSnapshot(doc);
          if (message) {
            this.topThreadMessageSignal.set(message);
          }
        }
    });
  }

  openViewProfile(userUID: string) {
    if (userUID == this.userService.currentOnlineUser().userUID) {
      this.profileViewLoggedUser = true;
    } else {
      this.profileViewUsersActive = true;
    }
  }

  isChatUser(option: ChatUser | Channel) {
    if (option instanceof ChatUser) {
      return true;
    } else {
      return false;
    }
  }
}
