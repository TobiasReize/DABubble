import { Component } from "@angular/core";
import { LoginHeaderComponent } from "../../shared/login-header/login-header.component";
import { Location } from "@angular/common";

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [LoginHeaderComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrls: [
    './privacy-policy.component.scss',
    '../../../styles/login.scss'
  ]
})
export class PrivacyPolicyComponent {

  constructor(private location: Location) { }


  goBack() {
    this.location.back();    
  }


}