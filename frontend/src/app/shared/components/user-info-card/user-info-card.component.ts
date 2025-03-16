import {
  Component,
  DestroyRef,
  inject,
  input,
  effect,
  output,
} from '@angular/core';
import { UserDetailsService } from './user-details.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-info-card',
  standalone: true,
  imports: [],
  templateUrl: './user-info-card.component.html',
  styleUrl: './user-info-card.component.scss',
})
export class UserInfoCardComponent {
  userId = input<string | undefined>();
  closeEvent = output<void>();

  protected readonly userService = inject(UserDetailsService);
  protected readonly destroyRef = inject(DestroyRef);
  protected user = this.userService.user;

  constructor() {
    effect(() => {
      if (this.userId()) {
        this.fetchUser();
      }
    });
  }

  onCloseClick(): void {
    this.closeEvent.emit();
  }

  private fetchUser(): void {
    this.userService
      .getUserDetails$(this.userId() as string)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
