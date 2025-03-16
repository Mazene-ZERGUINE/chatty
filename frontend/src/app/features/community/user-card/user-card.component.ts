import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  id = input.required<string>();
  username = input.required<string>();
  bio = input<string>();
  email = input.required<string>();
  phone = input.required<string>();
  avatarUrl = input.required<string>();
  isRequestSent = input.required<boolean>();

  userSelect = output<string>();
  sendRequest = output<string>();

  onSelectedUser(): void {
    this.userSelect.emit(this.id());
  }

  onSendFriendRequestClick(): void {
    this.sendRequest.emit(this.id());
  }
}
