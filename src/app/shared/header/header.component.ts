import { Component, inject } from '@angular/core';
import { UserService } from '../../core/services/user/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  userService = inject(UserService);

}
