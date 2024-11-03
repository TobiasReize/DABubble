import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserService } from './core/services/user/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'da-bubble';

  userService = inject(UserService);


  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    if (this.userService.currentUserUID() == '0') {
      console.log('Funktioniert!!!');
      this.userService.updateUserDoc('guest', {isOnline: false});
    } else {
      console.log('Funktioniert!!!');
      this.userService.updateUserDoc(this.userService.currentOnlineUser().userUID, {isOnline: false});
    }
  }
}
