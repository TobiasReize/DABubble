import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { LoginHeaderComponent } from '../../shared/login-header/login-header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UserService } from '../../core/services/user/user.service';
import { Auth, browserSessionPersistence, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, User, user } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

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
export class LogInComponent implements OnDestroy {

  hideIntroScreen: boolean = false;
  passwordFalse: boolean = false;
  userService = inject(UserService);
  private auth = inject(Auth);
  forwardedEmail: string | null = null;

  user$ = user(this.auth);
  userSubscription: Subscription;
  
  loginData = {
    email: '',
    password: ''
  }


  constructor(private router: Router, private activeRoute: ActivatedRoute) {
    this.userSubscription = this.user$.subscribe((currentUser: User | null) => {
      //handle user state changes here. Note, that user will be null if there is no currently logged in user.
      console.log('User subscription:', currentUser);
    });
  }


  ngOnInit(): void {
    this.setAuthStatePersistence();
    this.forwardedEmail = this.activeRoute.snapshot.queryParamMap.get('email')!;
    if (this.forwardedEmail) {
      this.loginData.email = this.forwardedEmail;
    }
  }


  setAuthStatePersistence() {
    const auth = getAuth();
    auth.setPersistence(browserSessionPersistence)
      .then(() => {
        console.log('Persistence geändert!');
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
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, this.loginData.email, this.loginData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.userService.currentOnlineUser = this.userService.allUsers[this.userService.getUserIndex(user.uid)];
        console.log('Aktueller User:', this.userService.currentOnlineUser);
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
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        await this.saveGoogleUser(user);  //await, damit der neue User gefunden werden kann und als currentOnlineUser übergeben werden kann!
        this.userService.currentOnlineUser = this.userService.allUsers[this.userService.getUserIndex(user.uid)];
        console.log('Aktueller User:', this.userService.currentOnlineUser);
        this.router.navigateByUrl('main');
      }).catch((error) => {
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log('Error-Code:', error.code);
        console.log('Error-Message:', error.message);
        console.log('Error-Email:', error.customData.email);
        console.log('Error-Credential:', credential);
      });
  }


  async saveGoogleUser(user: User) {
    let userIndex = this.userService.getUserIndex(user.uid);
    console.log('userIndex:', userIndex);
    if (userIndex == -1) {
      this.userService.newUser.name = user.displayName ? user.displayName : 'Google User';
      this.userService.newUser.email = user.email ? user.email : 'Google Mail';
      this.userService.newUser.avatar = user.photoURL ? user.photoURL : 'assets/img/profile.svg';
      this.userService.newUser.userUID = user.uid;
      await this.userService.addUser(this.userService.newUser.toJSON());
      console.log('Google-User hinzugefügt!');
    } else {
      console.log('Google-User bereits vorhanden!');
    }
  }
 

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }


}