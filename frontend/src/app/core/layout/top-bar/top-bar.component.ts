import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  WritableSignal,
} from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../auth/auth.service';
import { switchMap } from 'rxjs';
import { User } from '../../models/user.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationsListComponent } from '../../../shared/components/notifications-list/notifications-list.component';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
  imports: [NotificationsListComponent],
})
export class TopBarComponent implements OnDestroy {
  protected readonly notificationService = inject(NotificationService);
  protected readonly authService = inject(AuthService);
  protected readonly destroyRef = inject(DestroyRef);

  protected notificationNumber: WritableSignal<number> =
    this.notificationService.notificationNumber;

  protected notificationsDisplayed = false;

  private userId?: string;

  constructor() {
    effect(() => {
      const cachedUser = this.authService.userInformation();
      if (cachedUser?.id) {
        this.userId = cachedUser.id;
        this.notificationService.getNotifications$(this.userId).subscribe();
      } else {
        this.authService
          .getUserInformation$()
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            switchMap((user: User) => {
              this.userId = user.id;
              return this.notificationService.getNotifications$(user.id);
            }),
          )
          .subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.notificationService.disconnect();
  }

  displayNotificationList(): void {
    this.notificationsDisplayed = !this.notificationsDisplayed;
  }
}
