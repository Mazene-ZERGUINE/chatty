import { Component, input } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  username = input.required<string>();
  bio = input<string>();
  email = input.required<string>();
  phone = input.required<string>();
  avatarUrl = input.required<string>();
}
