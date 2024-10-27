import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChatUser } from '../../../../core/models/user.class';

@Component({
  selector: 'app-mention',
  standalone: true,
  imports: [],
  templateUrl: './mention.component.html',
  styleUrl: './mention.component.scss'
})
export class MentionComponent {
  @Input() user!: ChatUser;
  @ViewChild('mention', { read: ElementRef }) mention!: ElementRef;

  constructor() { }

  selectMention() {
    const selection = window.getSelection();
    selection?.removeAllRanges();
    const range = document.createRange();
    range.selectNodeContents(this.mention.nativeElement);
    selection?.addRange(range);
  }
}