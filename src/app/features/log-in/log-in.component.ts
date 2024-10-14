import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  loginTest: boolean = true;
  userService = inject(UserService);
  private auth = inject(Auth);

  user$ = user(this.auth);
  userSubscription: Subscription;
  
  loginData = {
    email: '',
    password: ''
  }


  constructor(private router: Router) {
    this.userSubscription = this.user$.subscribe((currentUser: User | null) => {
      //handle user state changes here. Note, that user will be null if there is no currently logged in user.
      console.log('User subscription:', currentUser);
    })
  }


  setIntroVariable(event: boolean) {
    this.hideIntroScreen = event;
    setTimeout(() => {
      this.userService.introDone = true;
    }, 500);
  }


  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid && !this.loginTest) {
      
    } else if (ngForm.submitted && ngForm.form.valid && this.loginTest) {  // Test-Bereich!
      this.signInUser();
      this.userService.currentOnlineUser = this.loginData;
      // console.log('Test-Login!:', this.userService.currentOnlineUser);
      ngForm.resetForm();
    }
  }


  signInUser() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.loginData.email, this.loginData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Login erfolgreich!', user);
        this.router.navigateByUrl('main');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Login fehlgeschlagen, Error-Code:', errorCode);
        console.log('Login fehlgeschlagen, Error-Message:', errorMessage);
      });
  }
 

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }


}