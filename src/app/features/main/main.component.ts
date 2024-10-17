import { Component, Signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ChatService } from '../../core/services/chat/chat.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { ChatComponent } from './chat/chat.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ThreadComponent } from './thread/thread.component';
import { SideNavService } from '../../core/services/sideNav/side-nav.service';
import { CreateChannelComponent } from "./side-nav/create-channel/create-channel.component";
import { EditChannelComponent } from './chat/edit-channel/edit-channel.component';
import { NewMessageComponent } from './side-nav/new-message/new-message.component';
import { DirectMessageComponent } from './side-nav/direct-message/direct-message.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeaderComponent,
    SideNavComponent,
    ChatComponent,
    CommonModule,
    ThreadComponent,
    NgIf,
    CreateChannelComponent,
    EditChannelComponent,
    NewMessageComponent,
    DirectMessageComponent
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  
})
export class MainComponent {
  isThreadVisible: Signal<boolean> = this.chatService.openThread;
  isEditChannelVisible: Signal<boolean> = this.chatService.openEditChannel;
  constructor(public chatService: ChatService, public sideNavService: SideNavService) {}
  sectionIsVisible: boolean = true;

  closeSection() {
    let section: HTMLElement | null = document.getElementById('section');
    if (section) {
      if (this.sectionIsVisible) {
        this.addSectionHiddenClass(section);
        this.changeImage(
          'menuButton',
          '../../../../assets/img/main/displayMenu.png'
        );

      } else {
        this.addSectionDisplayedClass(section);
        this.changeImage(
          'menuButton',
          '../../../../assets/img/main/blackMenu.png'
        );
      }
    }
  }

  addSectionHiddenClass(div: any) {
    div.classList.remove('sectionDisplayed');
    div.classList.add('sectionHidden');
    this.sectionIsVisible = false;
    console.log('false');
  }

  addSectionDisplayedClass(div: any) {
    div.classList.remove('sectionHidden');
    div.classList.add('sectionDisplayed');
    this.sectionIsVisible = true;
    console.log('true');
  }

  changeImage(imgId: any, newImgSrc: any) {
    const currentImg: any = document.getElementById(`${imgId}`);
    currentImg.src = `${newImgSrc}`;
  }

  
}

