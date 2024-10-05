import { Component } from '@angular/core';
import { LoginHeaderComponent } from '../shared/login-header/login-header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginHeaderComponent, FooterComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  
  registerTest: boolean = true;
  agreedPrivacyPolicy: boolean | 'empty' = 'empty';

  registerData = {
    name: '',
    email: '',
    password: ''
  }


  constructor(private router: Router) { }


  goTo(path: string) {
    this.router.navigateByUrl(path);    
  }


  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid && !this.registerTest) {
      
    } else if (ngForm.submitted && ngForm.form.valid && this.registerTest) {  // Test-Bereich!
      console.log('Test-Registrierung!:', this.registerData);
      ngForm.resetForm();
    }
  }


}