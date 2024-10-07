import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LoginHeaderComponent } from '../../shared/login-header/login-header.component';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginHeaderComponent, FooterComponent],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {

  newPassword: string = '';
  newPasswordRepeat: string = '';


  home() {

  }


  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      ngForm.resetForm();
    }
  }


}