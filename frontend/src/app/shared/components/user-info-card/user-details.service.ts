import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../../../core/models/user.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsService {
  user: WritableSignal<User | undefined> = signal(undefined);

  private readonly apiService = inject(ApiService);

  getUserDetails$(userId: string): Observable<User> {
    return this.apiService
      .getRequest<User>(`users/${userId}`)
      .pipe(tap((userInfo) => this.user.set(userInfo)));
  }
}
