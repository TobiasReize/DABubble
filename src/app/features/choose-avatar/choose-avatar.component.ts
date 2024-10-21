import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { LoginHeaderComponent } from '../../shared/login-header/login-header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user/user.service';
import { createUserWithEmailAndPassword, getAuth } from '@angular/fire/auth';
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';

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
  private readonly storage: Storage = inject(Storage);
  uploadInfo: string = '';
  uploadProgress: string = '';
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


  uploadImgToStorage(input: HTMLInputElement) {
    this.uploadFile = 'inProgress';
    this.uploadError = false;
    this.uploadInfo = '';
    this.uploadProgress = '';
    if (input.files) {
      const file = input.files.item(0);
      console.log('file', file);
      if (file && (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/svg+xml' || file.type == 'image/webp')) {
          const storageRef = ref(this.storage, this.userService.newUser.email + '/' + file.name);
          const uploadTask = uploadBytesResumable(storageRef, file);
          this.uploadInfo = file.name;

          uploadTask.on('state_changed', (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              this.uploadProgress = progress + '% (' + Math.round((snapshot.totalBytes / 1000)) + 'KB)';
            }, (error) => {
              this.uploadError = true;
              this.uploadInfo = 'Es ist ein Fehler aufgetreten! Bitte erneut versuchen.';
              this.uploadFile = 'done';
              console.log('Error:', error);
            }, () => {
              this.uploadFile = 'done';
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                this.profileImgPathSignal.set(downloadURL);
                this.profileHTML.nativeElement.src = this.profileImgPath();
                // console.log('Current profil img:', this.profileImgPath());
              })
            }
          )
        } else {
          this.uploadError = true;
          this.uploadInfo = 'Keine Datei vorhanden oder Dateityp fehlerhaft!';
          this.uploadFile = 'done';
        }
    } else {
      this.uploadError = true;
      this.uploadInfo = 'Keine Datei vorhanden!';
      this.uploadFile = 'done';
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