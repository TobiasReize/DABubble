import { Component, Input } from '@angular/core';
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

  openUserProfile(userUID: string) {
    console.log('opening user profile', userUID);
  }
}
