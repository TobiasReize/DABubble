import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [],
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.scss'
})
export class EmojiPickerComponent {
  emojis: string[] = [
    '😁','😀','😃','😄','😉','😊','😋','😎','🙂','😚','😪','😴','😌','😛','🤐','😂','🤣','😐','🤔','😮','😬','🤯','😇','🥳'
  ]

  @Output() selectEmojiEvent = new EventEmitter<string>();

  selectEmoji(emoji: string) {
    this.selectEmojiEvent.emit(emoji);
  }
}
