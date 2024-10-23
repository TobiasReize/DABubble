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
  emailFalse: boolean = false;
  errorMsg: string = 'Diese E-Mail-Adresse ist leider ungültig.';


  constructor(private location: Location, private router: Router) { }


  goBack() {
    this.location.back();    
  }


   async onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.emailFalse = false;
      await this.sendEmail();
      ngForm.resetForm();
    }
  }


  async sendEmail() {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, this.resetEmail)
      .then(() => {
        console.log('Passwort zurücksetzen Email versendet!', this.resetEmail);
        this.goToLogin();
      })
      .catch((error) => {
        this.emailFalse = true;
        this.errorMsg = 'Es ist ein Fehler aufgetreten. Bitte erneut versuchen.';
        console.log('Passwort zurücksetzen Error-Code:', error.code);
        console.log('Passwort zurücksetzen Error-Message:', error.message);
      });
  }


  goToLogin() {
    this.inputFinished = true;
    setTimeout(() => {
      this.router.navigateByUrl('');
    }, 1300);
  }


}