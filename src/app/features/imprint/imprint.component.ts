import { Component } from '@angular/core';
import { LoginHeaderComponent } from '../../shared/login-header/login-header.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [LoginHeaderComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

  constructor(private location: Location) { }


  goBack() {
    this.location.back();    
  }

  
}