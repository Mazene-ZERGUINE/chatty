import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { NotifierService } from '../services/notifier.service';

export const HttpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const notifier = inject(NotifierService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error);
      const errorMessage = error.error.error.message;
      if (
        error.status !== HttpStatusCode.Forbidden &&
        error.status !== HttpStatusCode.Unauthorized
      ) {
        notifier.showErrorMessage(errorMessage, 'Error occurred !');
      }
      return throwError(() => error);
    }),
  );
};
