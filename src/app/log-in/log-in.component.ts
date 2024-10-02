import { Component } from '@angular/core';
import { IntroComponent } from './intro/intro.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, IntroComponent],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  hideIntroScreen: boolean = false;
  introFinished: boolean = false;


  setIntroVariable(event: boolean) {
    this.hideIntroScreen = event;
    setTimeout(() => {
      this.introFinished = true;
    }, 500);
  }


}
