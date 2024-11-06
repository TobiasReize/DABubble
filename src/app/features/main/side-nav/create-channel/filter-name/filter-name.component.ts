import { Component, inject } from '@angular/core';
import { UserService } from '../../../../../core/services/user/user.service';
import { ChatUser } from '../../../../../core/models/user.class';
import { SideNavService } from '../../../../../core/services/sideNav/side-nav.service';
import { Channel } from '../../../../../core/models/channel.class';
import { ChatService } from '../../../../../core/services/chat/chat.service';
import { collection, doc, setDoc } from 'firebase/firestore';
import { FirebaseService } from '../../../../../core/services/firebase/firebase.service';

@Component({
  selector: 'app-filter-name',
  standalone: true,
  imports: [],
  templateUrl: './filter-name.component.html',
  styleUrl: './filter-name.component.scss'
})
export class FilterNameComponent {
  userService = inject(UserService);
  sideNavService = inject(SideNavService);
  chatService = inject(ChatService);
  fireBaseService = inject(FirebaseService);

  arrayOfChoosenContacts: ChatUser[] = [];
  userUIDs: string[] = [];
  contactsChoosen: boolean = false;
  notAddedSpecificPeopleToTheChannel: boolean = false;
  showedAllUsers: boolean = false;
  showPlaceholder: boolean = true;
  numberOfChoosenContacts: number = 0;
  filteredUsers: ChatUser[] = JSON.parse(
    JSON.stringify(this.userService.allUsers())
  );
  selectMembersFromDevspace: boolean = true;
  channelId: string = '';

  selectUser(index: number, userUID: string) {
    this.removeUser(userUID);
    const selectedUserIndex = this.userService
      .allUsers()
      .findIndex((user) => user.userUID === userUID);
    const selectedUser = this.userService.allUsers()[selectedUserIndex];
    this.arrayOfChoosenContacts.push(selectedUser);
    this.userUIDs.push(selectedUser.userUID);
    this.contactsChoosen = true;
    this.notAddedSpecificPeopleToTheChannel = false;
    this.showedAllUsers = false;
    const name = document.getElementById('addName');
    this.showPlaceholder = false;
    this.numberOfChoosenContacts++;
  }

  removeUser(userUID: string) {
    const index = this.filteredUsers.findIndex(
      (user) => user.userUID === userUID
    );
    if (index !== -1) {
      this.filteredUsers.splice(index, 1);
    }
  }

  async createChannel() {
    let channelName: HTMLInputElement = document.getElementById(
      'input1'
    ) as HTMLInputElement;
    let description: HTMLInputElement = document.getElementById(
      'input2'
    ) as HTMLInputElement;

    if (this.selectMembersFromDevspace) {
      this.addAllMembersFromDevspace();
    }

    if (this.arrayOfChoosenContacts.length > 0) {
      this.addSpecificUsersToTheUserUID();
      console.log('Specific Users added: ', this.userUIDs);
    }

    let channel = new Channel(
      this.chatService.contactIndex,
      channelName.value,
      description.value,
      this.userUIDs,
      this.userService.currentOnlineUser.name
    );

    this.channelId = doc(
      collection(this.fireBaseService.firestore, 'channels')
    ).id;

    this.sideNavService.addChannel(channel);

    await setDoc(
      doc(this.fireBaseService.firestore, 'channels', this.channelId),
      {
        name: channelName.value,
        description: description.value,
        createdBy: this.userService.currentOnlineUser.name,
        userIds: this.userUIDs,
      }
    );

    const addPeopleDiv: HTMLElement = document.getElementById(
      'addPeople'
    ) as HTMLElement;
    addPeopleDiv.style.display = 'flex';
    const createChannelDiv: HTMLElement = document.getElementById(
      'createChannel'
    ) as HTMLElement;
    createChannelDiv.style.display = 'none';

    this.onDiv1Click();
  }

  addAllMembersFromDevspace() {
    this.userUIDs = [];
    this.userService.allUsers().forEach((user) => {
      this.userUIDs.push(user.userUID);
    });
  }

  addSpecificUsersToTheUserUID() {
    this.userUIDs = [];
    this.arrayOfChoosenContacts.forEach((user) => {
      this.userUIDs.push(user.userUID);
    });
  }

  onDiv1Click(): void {
    this.sideNavService.createChannelsDivOpened = false;
  }
}
