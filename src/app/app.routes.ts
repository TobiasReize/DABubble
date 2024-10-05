import { Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { MainComponent } from './main/main.component';
import { SideNavComponent } from './main/side-nav/side-nav.component';

export const routes: Routes = [
    { path: '', component: LogInComponent },
    { path: 'main', component: MainComponent },
    { path: 'side-nav', component: SideNavComponent },
];