import { Component, inject } from '@angular/core';
import { LoginHeaderComponent } from '../../shared/login-header/login-header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user/user.service';
import { createUserWithEmailAndPassword, getAuth } from '@angular/fire/auth';

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


  registerNewUser() {   //User wird auch direkt in Firebase eingeloggt!
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, this.userService.newUser.email, this.userService.newUser.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Registrierung erfolgreich!');
        this.userService.newUser.userUID = user.uid;
        this.userService.newUser.avatar = this.currentProfileImg;
        this.userService.addUser(this.userService.newUser.toJSON());
        this.goToLogin();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Registrierung fehlgeschlagen, Error-Code:', errorCode);
        console.log('Registrierung fehlgeschlagen, Error-Message:', errorMessage);
      });
  }


  goToLogin() {
    this.inputFinished = true;
    setTimeout(() => {
      this.router.navigateByUrl('');
    }, 1300);
  }


}