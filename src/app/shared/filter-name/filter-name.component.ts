import { Component, EventEmitter, inject, Input, input, Output } from '@angular/core';
import { SideNavService } from '../../core/services/sideNav/side-nav.service';
import { ChatUser } from '../../core/models/user.class';
import { UserService } from '../../core/services/user/user.service';

@Component({
  selector: 'app-filter-name',
  standalone: true,
  imports: [],
  templateUrl: './filter-name.component.html',
  styleUrl: './filter-name.component.scss'
})
export class FilterNameComponent {
  
  constructor(public sideNavService: SideNavService, public userService: UserService) {}
  
  @Input()showedAllUsers: boolean = false;
  @Input()filteredUsers: ChatUser[] = [];
  @Input()arrayOfChoosenContacts: ChatUser[] = [];
  @Input()userUIDs: string[] = [];
  @Input()contactsChoosen: boolean = false;
  @Input()notAddedSpecificPeopleToTheChannel: boolean = false;
  @Input()id: string = "";
  @Input()showPlaceholder: boolean = true;
  
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
    const name = document.getElementById(this.id);
    this.showPlaceholder = false;
    this.sideNavService.numberOfChoosenContacts++;
  }

  removeUser(userUID: string) {
    const index = this.filteredUsers.findIndex(
      (user) => user.userUID === userUID
    );
    if (index !== -1) {
      this.filteredUsers.splice(index, 1);
    }
  }
}
