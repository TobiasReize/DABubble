import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-header',
  standalone: true,
  imports: [],
  templateUrl: './login-header.component.html',
  styleUrl: './login-header.component.scss'
})
export class LoginHeaderComponent {

  @Input() loginSite: boolean = true;

  constructor(private router: Router) { }


  goToRegister() {
    this.router.navigateByUrl('register');
  }


}