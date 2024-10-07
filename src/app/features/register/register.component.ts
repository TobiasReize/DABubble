import { CommonModule, Location } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { RouterLink, Router } from "@angular/router";
import { FooterComponent } from "../../shared/footer/footer.component";
import { LoginHeaderComponent } from "../../shared/login-header/login-header.component";


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginHeaderComponent, FooterComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  
  registerTest: boolean = true;
  agreedPrivacyPolicy: boolean = false;

  registerData = {
    name: '',
    email: '',
    password: ''
  }


  constructor(private router: Router, private location: Location) { }


  goBack() {
    this.location.back();    
  }


  toggleCheckbox() {
    this.agreedPrivacyPolicy = !this.agreedPrivacyPolicy;
  }


  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid && !this.registerTest) {
      ngForm.resetForm();
      this.agreedPrivacyPolicy = false;
      this.router.navigateByUrl('choose-avatar');

    } else if (ngForm.submitted && ngForm.form.valid && this.registerTest) {  // Test-Bereich!
      console.log('Test-Registrierung!:', this.registerData);
      ngForm.resetForm();
      this.agreedPrivacyPolicy = false;
      this.router.navigateByUrl('choose-avatar');
    }
  }


}