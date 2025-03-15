import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserRegister } from './models/user-register.model';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { UserLogin } from './models/user-login.model';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  registerSuccess: WritableSignal<boolean> = signal(false);
  loginSuccess: WritableSignal<boolean> = signal(false);
  isAuthenticated: WritableSignal<boolean> = signal(false);

  userInformation: WritableSignal<User | null> = signal(null);

  private readonly apiService: ApiService = inject(ApiService);

  register$(userRegisterRequest: UserRegister): Observable<void> {
    return this.apiService
      .postRequest<UserRegister, void>(
        'auth/register',
        userRegisterRequest,
        true,
      )
      .pipe(tap(() => this.registerSuccess.set(true)));
  }

  login$(userLoginRequest: UserLogin): Observable<void> {
    return this.apiService
      .postRequest<UserLogin, void>('auth/login', userLoginRequest, true)
      .pipe(tap(() => this.loginSuccess.set(true)));
  }

  refreshToken(): Observable<boolean> {
    return this.apiService.getRequest<void>('auth/refresh', true).pipe(
      tap(() => this.isAuthenticated.set(true)),
      switchMap(() => of(true)),
      catchError(() => {
        this.isAuthenticated.set(false);
        return of(false);
      }),
    );
  }

  getUserInformation$(): Observable<User> {
    return this.apiService
      .getRequest<User>('auth/me')
      .pipe(tap((user: User) => this.userInformation.set(user)));
  }

  checkAuthStatus(): Observable<boolean> {
    return this.refreshToken();
  }

  logout(): Observable<void> {
    return this.apiService.getRequest<void>('auth/logout', true);
  }
}
