import { Component } from '@angular/core';
import { LoginHeaderComponent } from '../shared/login-header/login-header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule, LoginHeaderComponent, FooterComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  resetEmail: string = '';


  constructor(private router: Router) { }


  home() {
    this.router.navigateByUrl('');
  }


  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      ngForm.resetForm();
    }
  }


}