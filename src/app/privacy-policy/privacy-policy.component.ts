import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginHeaderComponent } from '../shared/login-header/login-header.component';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [LoginHeaderComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {

  constructor(private router: Router) { }


  home() {
    this.router.navigateByUrl('');    
  }


}