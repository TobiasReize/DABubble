import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss'
})
export class IntroComponent implements OnInit {

  @Output() hideIntroScreen = new EventEmitter<boolean>();


  ngOnInit(): void {
    setTimeout(() => {
      this.exitIntroScreen();
    }, 2500);
  }


  exitIntroScreen() {
    this.hideIntroScreen.emit(true);
  }


}