import {
  DestroyRef,
  effect,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { Observable, tap } from 'rxjs';
import { NotificationPayload } from '../models/notification-payload.interface';
import { AuthService } from '../auth/auth.service';
import { io, Socket } from 'socket.io-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notificationsList: WritableSignal<NotificationPayload[]> = signal([]);
  notificationNumber: WritableSignal<number> = signal(0);

  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly apiService = inject(ApiService);

  private socket!: Socket;

  constructor() {
    this.requestNotificationPermission();

    effect(() => {
      const userId = this.authService.userInformation()?.id;
      if (userId) {
        this.connect(userId);
      } else {
        this.authService
          .getUserInformation$()
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            tap((user) => this.connect(user.id)),
          )
          .subscribe();
      }
    });
  }

  getNotifications$(userId: string): Observable<NotificationPayload[]> {
    return this.apiService
      .getRequest<NotificationPayload[]>(`notifications/user/${userId}`)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((result) => {
          this.notificationsList.set(result);
          this.updateNotificationCount();
        }),
      );
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  private connect(userId: string): void {
    this.socket = io('http://localhost:3000', {
      query: { userId: userId.toString() },
    });

    this.socket.on('new_notification', (notification: NotificationPayload) => {
      console.log('New notification received:', notification);
      this.notificationsList.update((prev) => [notification, ...prev]);
      this.updateNotificationCount();

      this.showPushNotification(notification);
    });
  }

  private updateNotificationCount(): void {
    this.notificationNumber.set(this.notificationsList().length);
  }

  private async requestNotificationPermission(): Promise<void> {
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
  }

  private showPushNotification(notification: NotificationPayload): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.type, {
        body: notification.content,
      });
    }
  }
}
