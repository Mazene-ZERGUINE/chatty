import { Component, input, OnInit } from '@angular/core';
import {
  NotificationPayload,
  NotificationType,
} from '../../../core/models/notification-payload.interface';
import { JsonPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [JsonPipe, UpperCasePipe],
  templateUrl: './notifications-list.component.html',
  styleUrl: './notifications-list.component.scss',
})
export class NotificationsListComponent implements OnInit {
  notification = input.required<NotificationPayload[]>();
  readonly NotificationType = NotificationType;

  ngOnInit(): void {
    console.log(this.notification());
  }
}
