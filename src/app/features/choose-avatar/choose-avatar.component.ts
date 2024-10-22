import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { LoginHeaderComponent } from '../../shared/login-header/login-header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user/user.service';
import { createUserWithEmailAndPassword, getAuth } from '@angular/fire/auth';
import { FirebaseService } from '../../core/services/firebase/firebase.service';

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
  firebaseService = inject(FirebaseService);
  uploadInfo: string = '';
  uploadFile: null | 'inProgress' | 'done' = null;
  uploadError: boolean = false;
  @ViewChild('profile') profileHTML!: ElementRef;
  private profileImgPathSignal = signal<string>('assets/img/profile.svg');
  readonly profileImgPath = this.profileImgPathSignal.asReadonly();
  profileImages = [
    'assets/img/avatar0.svg',
    'assets/img/avatar1.svg',
    'assets/img/avatar2.svg',
    'assets/img/avatar3.svg',
    'assets/img/avatar4.svg',
    'assets/img/avatar5.svg',
  ];


  constructor(private location: Location, private router: Router) { }


  goBack() {
    this.location.back();
  }


  changeProfileImg(index: number) {
    this.profileImgPathSignal.set(this.profileImages[index]);
    this.uploadFile = null;
  }


  uploadImg(input: HTMLInputElement) {
    this.uploadFile = 'inProgress';
    this.uploadError = false;
    this.uploadInfo = '';
    const file = input.files?.item(0);
    if (file) {
      console.log('file', file);
      switch (true) {
        case file.type != 'image/jpeg' || 'image/png' || 'image/svg+xml' || 'image/webp':
          this.handleUploadError('type');
          break;
        case file.size >= 1000000:
          this.handleUploadError('size');
          break;
        default:
          this.uploadImgToStorage(file);
      }
    }
  }


  handleUploadError(info: string) {
    this.uploadError = true;
    this.uploadFile = 'done';
    if (info == 'size') {
      this.uploadInfo = 'Datei zu groß! Dateigröße < 1MB';
    } else {
      this.uploadInfo = 'Kein gültiger Dateityp! Bitte JPEG, PNG, SVG oder WEBP auswählen';
    }
  }


  async uploadImgToStorage(file: File) {
    const path = 'profil-images/' + this.userService.newUser.email + '/' + file.name;
    this.uploadInfo = file.name;
    try {
      await this.firebaseService.uploadFileToStorage(file, path);
      this.profileImgPathSignal.set(this.firebaseService.downloadURL);
      this.profileHTML.nativeElement.src = this.profileImgPath();
      this.uploadFile = 'done';
      console.log('Current profil img:', this.profileImgPath());
    } catch (error) {
      this.uploadError = true;
      this.uploadInfo = 'Es ist ein Fehler aufgetreten! Bitte erneut versuchen.';
      this.uploadFile = 'done';
      console.log('Error:', error);
    }
  }


  registerNewUser() {   //User wird auch direkt in Firebase eingeloggt!
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, this.userService.newUser.email, this.userService.newUser.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Registrierung erfolgreich!');
        this.userService.newUser.userUID = user.uid;
        this.userService.newUser.avatar = this.profileImgPath();
        this.userService.addUser(this.userService.newUser.toJSON());
        this.goToLogin();
      })
      .catch((error) => {
        console.log('Registrierung fehlgeschlagen, Error-Code:', error.code);
        console.log('Registrierung fehlgeschlagen, Error-Message:', error.message);
      });
  }


  goToLogin() {
    this.inputFinished = true;
    setTimeout(() => {
      this.router.navigateByUrl('');
    }, 1300);
  }


}