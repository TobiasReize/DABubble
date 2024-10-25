import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mention',
  standalone: true,
  imports: [],
  templateUrl: './mention.component.html',
  styleUrl: './mention.component.scss'
})
export class MentionComponent {
  @Input() userName: string = '';

  removeMention() {
    console.log('removing mention');
  }
}
