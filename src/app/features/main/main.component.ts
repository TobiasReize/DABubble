import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChatService } from '../../core/services/chat/chat.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { ChatComponent } from './chat/chat.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ThreadComponent } from './thread/thread.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeaderComponent,
    SideNavComponent,
    ChatComponent,
    CommonModule,
    ThreadComponent,
    NgIf
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  
})

export class MainComponent implements OnInit, OnDestroy {
  isThreadVisible: boolean = false;
  threadVisibilitySubscription!: Subscription;
  constructor(private chatService: ChatService) {}
  sectionIsVisible: boolean = true;

  ngOnInit() {
    this.threadVisibilitySubscription = this.chatService
      .threadVisibilityListener()
      .subscribe((bool: boolean) => {
        this.isThreadVisible = bool;
      });
  }

  ngOnDestroy() {
    this.threadVisibilitySubscription.unsubscribe();
  }

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
  }

  addSectionDisplayedClass(div: any) {
    div.classList.remove('sectionHidden');
    div.classList.add('sectionDisplayed');
    this.sectionIsVisible = true;
  }

  changeImage(imgId: any, newImgSrc: any) {
    const currentImg: any = document.getElementById(`${imgId}`);
    currentImg.src = `${newImgSrc}`;
  }
}
