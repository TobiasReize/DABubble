import { CommonModule, Location } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { RouterLink, Router } from "@angular/router";
import { FooterComponent } from "../../shared/footer/footer.component";
import { LoginHeaderComponent } from "../../shared/login-header/login-header.component";
import { UserService } from "../../core/services/user/user.service";


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginHeaderComponent, FooterComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: [
    './register.component.scss',
    '../../../styles/login.scss'
  ]
})
export class RegisterComponent {
  
  registerTest: boolean = true;
  agreedPrivacyPolicy: boolean = false;
  userService = inject(UserService);

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
      this.setNewUser();
      ngForm.resetForm();
      this.agreedPrivacyPolicy = false;
      this.router.navigateByUrl('choose-avatar');
      
    } else if (ngForm.submitted && ngForm.form.valid && this.registerTest) {  // Test-Bereich!
      this.setNewUser();
      // console.log('Test-Registrierung!:', this.userService.newUser);
      ngForm.resetForm();
      this.agreedPrivacyPolicy = false;
      this.router.navigateByUrl('choose-avatar');
    }
  }


  setNewUser() {
    this.userService.user.name = this.registerData.name;
    this.userService.user.email = this.registerData.email;
    this.userService.user.password = this.registerData.password;
  }


}