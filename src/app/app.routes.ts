import { Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { MainComponent } from './main/main.component';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { RegisterComponent } from './register/register.component';
import { ChooseAvatarComponent } from './choose-avatar/choose-avatar.component';

export const routes: Routes = [
    { path: '', component: LogInComponent },
    { path: 'main', component: MainComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'choose-avatar', component: ChooseAvatarComponent },
    { path: 'imprint', component: ImprintComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
];