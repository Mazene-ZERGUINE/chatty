import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { take } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-side-bar-menu',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './side-bar-menu.component.html',
  styleUrl: './side-bar-menu.component.scss',
})
export class SideBarMenuComponent {
  readonly router: Router = inject(Router);
  readonly authService: AuthService = inject(AuthService);

  currentUrl = this.router.url.split('/')[1];
  user = this.authService.userInformation;

  constructor() {
    effect(() => {
      if (this.user() === null) {
        this.authService.getUserInformation$().pipe(take(1)).subscribe();
      }
    });
  }
}
