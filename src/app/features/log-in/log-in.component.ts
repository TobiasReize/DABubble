import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { LoginHeaderComponent } from '../../shared/login-header/login-header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UserService } from '../../core/services/user/user.service';

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
export class LogInComponent {

  hideIntroScreen: boolean = false;
  loginTest: boolean = true;
  userService = inject(UserService);
  
  loginData = {
    email: '',
    password: ''
  }


  constructor(private router: Router) { }


  setIntroVariable(event: boolean) {
    this.hideIntroScreen = event;
    setTimeout(() => {
      this.userService.introDone = true;
    }, 500);
  }


  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid && !this.loginTest) {
      
    } else if (ngForm.submitted && ngForm.form.valid && this.loginTest) {  // Test-Bereich!
      this.userService.currentOnlineUser = this.loginData;
      console.log('Test-Login!:', this.userService.currentOnlineUser);
      ngForm.resetForm();
      this.router.navigateByUrl('main');
    }
  }


}