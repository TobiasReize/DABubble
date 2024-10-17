import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LoginHeaderComponent } from '../../shared/login-header/login-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, confirmPasswordReset, verifyPasswordResetCode } from "@angular/fire/auth";

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginHeaderComponent, FooterComponent],
  templateUrl: './new-password.component.html',
  styleUrls: [
    './new-password.component.scss',
    '../../../styles/login.scss'
  ]
})
export class NewPasswordComponent implements OnInit {

  newPassword: string = '';
  newPasswordRepeat: string = '';
  inputFinished: boolean = false;
  private auth = inject(Auth);
  private mode!: string;
  private actionCode!: string;
  userEmail = '';


  constructor(private location: Location, private router: Router, private activeRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.actionCode = this.activeRoute.snapshot.queryParamMap.get('oobCode')!;
    this.mode = this.activeRoute.snapshot.queryParamMap.get('mode')!;
    console.log('oobCode:', this.actionCode);
    console.log('mode:', this.mode);
  }


  goBack() {
    this.location.back();
  }


  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.handleResetPassword(this.auth, this.actionCode, ngForm);
    }
  }


  handleResetPassword(auth: Auth, actionCode: string, ngForm: NgForm) {
    verifyPasswordResetCode(auth, actionCode).then((email) => {
      console.log('Action code is valid! From:', email);
      this.userEmail = email;
      
      confirmPasswordReset(auth, actionCode, this.newPassword).then((resp) => {
        console.log('Neues Passwort:', this.newPassword);
        console.log('New password accepted!', resp);
        ngForm.resetForm();
        this.goToLogin();
      }).catch((error) => {
        console.log('New password rejected!', error);
        // Error occurred during confirmation. The code might have expired or the password is too weak.
      });
    }).catch((error) => {
      // Invalid or expired action code. Ask user to try to reset the password again.
      console.log('Action code invalid!', error);
    });
  }


  goToLogin() {
    this.inputFinished = true;
    setTimeout(() => {
      this.router.navigateByUrl('' + '?email=' + this.userEmail);
    }, 1300);
  }


}