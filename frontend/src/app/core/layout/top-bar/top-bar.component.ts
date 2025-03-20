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

@Component({
  selector: 'app-top-bar',
  standalone: true,
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent implements OnDestroy {
  protected readonly notificationService = inject(NotificationService);
  protected readonly authService = inject(AuthService);
  protected readonly destroyRef = inject(DestroyRef);

  protected readonly notificationList =
    this.notificationService.notificationsList;

  protected notificationNumber: WritableSignal<number> =
    this.notificationService.notificationNumber;

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
}
