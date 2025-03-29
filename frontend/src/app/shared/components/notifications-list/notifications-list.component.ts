import { Component, DestroyRef, inject } from '@angular/core';
import { JsonPipe, UpperCasePipe } from '@angular/common';
import { RelationsService } from '../../service/relations.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../core/services/notification.service';
import { switchMap } from 'rxjs';
import { NotificationType } from '../../../core/models/notification-payload.interface';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [UpperCasePipe, JsonPipe],
  templateUrl: './notifications-list.component.html',
  styleUrl: './notifications-list.component.scss',
})
export class NotificationsListComponent {
  readonly notificationService = inject(NotificationService);
  notification = this.notificationService.notificationsList;

  protected readonly NotificationType = NotificationType;

  private readonly relationService = inject(RelationsService);
  private readonly destroyRef = inject(DestroyRef);

  onRequestActionClick(
    requestId: number,
    action: boolean,
    notificationId: number,
  ): void {
    this.relationService
      .handelFriendRequest(requestId, action)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() =>
          this.notificationService.refreshNotifications$(notificationId),
        ),
      )
      .subscribe(console.log);
  }

  onMarkAsReadClick(notificationId: number): void {
    this.notificationService
      .markNotificationAsRead$(notificationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
