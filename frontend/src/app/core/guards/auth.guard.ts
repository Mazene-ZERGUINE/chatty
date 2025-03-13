import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { DestroyRef, inject } from '@angular/core';
import { catchError, EMPTY, map, Observable, of, tap } from 'rxjs';

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
