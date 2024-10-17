import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { LoginHeaderComponent } from '../../shared/login-header/login-header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UserService } from '../../core/services/user/user.service';
import { Auth, getAuth, signInWithEmailAndPassword, User, user } from '@angular/fire/auth';
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
    this.forwardedEmail = this.activeRoute.snapshot.queryParamMap.get('email')!;
    if (this.forwardedEmail) {
      this.loginData.email = this.forwardedEmail;
    }
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
        const errorCode = error.code;
        const errorMessage = error.message;
        this.passwordFalse = true;
        console.log('Login fehlgeschlagen, Error-Code:', errorCode);
        console.log('Login fehlgeschlagen, Error-Message:', errorMessage);
      });
  }
 

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }


}