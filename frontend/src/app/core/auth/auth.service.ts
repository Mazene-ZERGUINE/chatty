import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserRegister } from './models/user-register.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  registerSuccess: WritableSignal<boolean> = signal(false);

  private readonly apiService: ApiService = inject(ApiService);

  register$(userRegisterRequest: UserRegister): Observable<void> {
    return this.apiService
      .postRequest<UserRegister, void>('auth/register', userRegisterRequest)
      .pipe(tap(() => this.registerSuccess.set(true)));
  }
}
