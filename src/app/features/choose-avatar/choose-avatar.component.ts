import { Component, inject } from '@angular/core';
import { LoginHeaderComponent } from '../../shared/login-header/login-header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user/user.service';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [CommonModule, LoginHeaderComponent, FooterComponent],
  templateUrl: './choose-avatar.component.html',
  styleUrls: [
    './choose-avatar.component.scss',
    '../../../styles/login.scss'
  ]
})
export class ChooseAvatarComponent {

  inputFinished: boolean = false;
  userService = inject(UserService);
  currentProfileImg = 'profile.svg';
  profileImages = [
    'avatar0.svg',
    'avatar1.svg',
    'avatar2.svg',
    'avatar3.svg',
    'avatar4.svg',
    'avatar5.svg',
  ];


  constructor(private location: Location, private router: Router) { }


  goBack() {
    this.location.back();    
  }


  changeProfileImg(index: number) {
    this.currentProfileImg = this.profileImages[index];
  }


  goToLogin() {
    this.inputFinished = true;
    this.userService.newUser.avatar = this.currentProfileImg;
    console.log('Neuer User:', this.userService.newUser);
    setTimeout(() => {
      this.router.navigateByUrl('');
    }, 1300);
  }


}