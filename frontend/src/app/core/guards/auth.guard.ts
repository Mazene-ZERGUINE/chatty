import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

export const AuthGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return of(true);
  }
  return authService.checkAuthStatus().pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/auth']);
      }
      return isAuthenticated;
    }),
    catchError(() => {
      router.navigate(['/auth']);
      return of(false);
    }),
  );
};
