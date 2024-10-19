import { Component, inject } from '@angular/core';
import { LoginHeaderComponent } from '../../shared/login-header/login-header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user/user.service';
import { createUserWithEmailAndPassword, getAuth } from '@angular/fire/auth';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from '@angular/fire/storage';

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


  uploadImg() {
    const storage = getStorage();
    const user1Ref = ref(storage, 'user1');
    const user1Img = ref(storage, 'user1/pizza.jpg');
    const fileRef = ref(storage, 'user1/pasta.jpg');
    console.log('Referenz:', user1Img);

    const uploadTask = uploadBytesResumable(fileRef, new Blob);
      // .then((snapshot) => {
      //   console.log('Uploaded a blob or file!', snapshot);
      // });

    uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        switch (error.code) {
          case 'storage/unauthorized':
            console.log('User doesn\'t have permission to access the object', error);
            break;
          case 'storage/canceled':
            console.log('User canceled the upload', error);
            break;
          case 'storage/unknown':
            console.log('Unknown error occurred, inspect error.serverResponse', error);
            break;
          default:
            console.log('Error:', error);
        }
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
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