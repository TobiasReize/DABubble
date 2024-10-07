import { Component } from '@angular/core';
import { LoginHeaderComponent } from '../../shared/login-header/login-header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [CommonModule, LoginHeaderComponent, FooterComponent],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {

  currentProfileImg = 'assets/img/profile.svg';
  profileImages = [
    'assets/img/avatar0.svg',
    'assets/img/avatar1.svg',
    'assets/img/avatar2.svg',
    'assets/img/avatar3.svg',
    'assets/img/avatar4.svg',
    'assets/img/avatar5.svg',
  ];


  constructor(private location: Location) { }


  goBack() {
    this.location.back();    
  }


  changeProfileImg(index: number) {
    this.currentProfileImg = this.profileImages[index];
  }


}