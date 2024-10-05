import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginHeaderComponent } from '../shared/login-header/login-header.component';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [LoginHeaderComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

  constructor(private router: Router) { }


  home() {
    this.router.navigateByUrl('');    
  }

  
}