import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpErrorInterceptor } from './core/interceptors/http-errors.interceptor';
import { provideToastr } from 'ngx-toastr';
import { HttpAuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(
      withInterceptors([HttpErrorInterceptor, HttpAuthInterceptor]),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideToastr(),
    provideRouter(routes),
  ],
};
