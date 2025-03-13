import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const HttpAuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === HttpStatusCode.Unauthorized ||
        error.status === HttpStatusCode.Forbidden
      ) {
        return authService.refreshToken().pipe(switchMap(() => next(req)));
      }
      return throwError(() => error);
    }),
  );
};
