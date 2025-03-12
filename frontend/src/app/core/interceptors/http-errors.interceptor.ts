import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
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
      notifier.showErrorMessage(errorMessage, 'Error occurred !');
      return throwError(() => error);
    }),
  );
};
