import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LoginHeaderComponent } from '../../shared/login-header/login-header.component';
import { Router } from '@angular/router';
import { getAuth, sendPasswordResetEmail } from '@angular/fire/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule, LoginHeaderComponent, FooterComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: [
    './reset-password.component.scss',
    '../../../styles/login.scss'
  ]
})
export class ResetPasswordComponent {

  resetEmail: string = '';
  inputFinished: boolean = false;


  constructor(private location: Location, private router: Router) { }


  goBack() {
    this.location.back();    
  }


  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.sendEmail();
      ngForm.resetForm();
      this.goToLogin();
    }
  }


  sendEmail() {
    const auth = getAuth();
    const actionCodeSettings = {
      url: 'http://dabubble-374.developerakademie.net/angular-projects/dabubble/?email=' + this.resetEmail,
    };

    sendPasswordResetEmail(auth, this.resetEmail, actionCodeSettings)
      .then(() => {
        console.log('Passwort zurücksetzen Email versendet!');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Passwort zurücksetzen Error-Code:', errorCode);
        console.log('Passwort zurücksetzen Error-Message:', errorMessage);
      });
  }


  goToLogin() {
    this.inputFinished = true;
    setTimeout(() => {
      this.router.navigateByUrl('');
    }, 1300);
  }


}