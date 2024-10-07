import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-textarea',
  standalone: true,
  imports: [],
  templateUrl: './message-textarea.component.html',
  styleUrl: './message-textarea.component.scss'
})
export class MessageTextareaComponent {
  @Input() placeholder: string = 'Nachricht an #';
}