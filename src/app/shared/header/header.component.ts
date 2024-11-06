import { Component, inject, NgModule } from '@angular/core';
import { UserService } from '../../core/services/user/user.service';
import { FormsModule } from '@angular/forms';
import { SearchComponentComponent } from "../../features/main/search-component/search-component.component";
import { SideNavService } from '../../core/services/sideNav/side-nav.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, SearchComponentComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userService = inject(UserService);
  sideNavService = inject(SideNavService);

  onSearch() {
    this.sideNavService.search = true;
  }
}
