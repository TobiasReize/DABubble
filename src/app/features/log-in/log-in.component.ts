import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { LoginHeaderComponent } from '../../shared/login-header/login-header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UserService } from '../../core/services/user/user.service';
import { Auth, browserSessionPersistence, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, User } from '@angular/fire/auth';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule, IntroComponent, LoginHeaderComponent, FooterComponent, RouterLink],
  templateUrl: './log-in.component.html',
  styleUrls: [
    './log-in.component.scss',
    '../../../styles/login.scss'
  ]
})
export class LogInComponent implements OnInit {

  hideIntroScreen: boolean = false;
  passwordFalse: boolean = false;
  userService = inject(UserService);
  private auth = inject(Auth);
  forwardedEmail: string | null = null;
  googleLoginError: boolean = false;
  
  loginData = {
    email: '',
    password: ''
  }


  constructor(private router: Router, private activeRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.setAuthStatePersistence();
    this.forwardedEmail = this.activeRoute.snapshot.queryParamMap.get('email')!;
    if (this.forwardedEmail) {
      this.loginData.email = this.forwardedEmail;
    }
  }


  setAuthStatePersistence() {
    this.auth.setPersistence(browserSessionPersistence)
      .then(() => {
        // console.log('Persistence geändert!');
      })
      .catch((error) => {
        console.log('Error-Code:', error.code);
        console.log('Error-Message:', error.message);
      });
  }


  setIntroVariable(event: boolean) {
    this.hideIntroScreen = event;
    setTimeout(() => {
      this.userService.introDone = true;
    }, 500);
  }


  async onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.passwordFalse = false;
      await this.signInUser();
      ngForm.resetForm();
    }
  }


  async signInUser() {
    // const auth = getAuth();
    await signInWithEmailAndPassword(this.auth, this.loginData.email, this.loginData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.userService.currentUserUIDSignal.set(user.uid);
        console.log('Aktueller User:', this.userService.currentOnlineUser());
        this.router.navigateByUrl('main');
      })
      .catch((error) => {
        this.passwordFalse = true;
        console.log('Login fehlgeschlagen, Error-Code:', error.code);
        console.log('Login fehlgeschlagen, Error-Message:', error.message);
      });
  }


  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    // const auth = getAuth();
    this.googleLoginError = false;
    signInWithPopup(this.auth, provider)
      .then(async (result) => {
        const user = result.user;
        await this.saveGoogleUser(user);  //await, damit der neue User gefunden werden kann und als currentOnlineUser übergeben werden kann!
        this.userService.currentUserUIDSignal.set(user.uid);
        console.log('Aktueller User:', this.userService.currentOnlineUser());
        this.router.navigateByUrl('main');
      }).catch((error) => {
        this.googleLoginError = true;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log('Error-Code:', error.code);
        console.log('Error-Message:', error.message);
        console.log('Error-Email:', error.customData.email);
        console.log('Error-Credential:', credential);
      });
  }


  async saveGoogleUser(user: User) {
    let userIndex = this.userService.getUserIndexWithUID(user.uid);
    console.log('userIndex:', userIndex);
    if (userIndex == -1) {
      this.userService.newUser.name = user.displayName ? user.displayName : 'Google User';
      this.userService.newUser.email = user.email ? user.email : 'Google Mail';
      this.userService.newUser.avatar = user.photoURL ? user.photoURL : 'assets/img/profile.svg';
      this.userService.newUser.userUID = user.uid;
      await this.userService.addUser(user.uid, this.userService.newUser.toJSON());
      console.log('Google-User hinzugefügt!');
    } else {
      console.log('Google-User bereits vorhanden!');
    }
  }


  signInWithGuest() {
    this.userService.signOutUser();
    this.userService.currentUserUIDSignal.set('0');
    console.log('Aktueller User:', this.userService.currentOnlineUser());
    this.router.navigateByUrl('main');
  }


}