import { Component } from '@angular/core';
import { LoginHeaderComponent } from '../shared/login-header/login-header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [LoginHeaderComponent, FooterComponent],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {

  selectedProfileImg = 'assets/img/profile.svg';


  constructor(private router: Router) { }


  goToRegister() {
    this.router.navigateByUrl('register');    
  }


  changeProfileImg(index: number) {
    this.selectedProfileImg = 'assets/img/avatar' + index + '.svg';
  }


}