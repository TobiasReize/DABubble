import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { LoginHeaderComponent } from '../../shared/login-header/login-header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule, IntroComponent, LoginHeaderComponent, FooterComponent, RouterLink],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  hideIntroScreen: boolean = false;
  introFinished: boolean = false;
  loginTest: boolean = true;
  
  loginData = {
    email: '',
    password: ''
  }


  setIntroVariable(event: boolean) {
    this.hideIntroScreen = event;
    setTimeout(() => {
      this.introFinished = true;
    }, 500);
  }


  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid && !this.loginTest) {
      
    } else if (ngForm.submitted && ngForm.form.valid && this.loginTest) {  // Test-Bereich!
      console.log('Test-Login!:', this.loginData);
      ngForm.resetForm();
    }
  }


}