import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable, tap } from 'rxjs';
import { Group } from '../../core/models/group.interface';
import { User } from '../../core/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  groupsList: WritableSignal<Group[]> = signal([]);
  usersList: WritableSignal<User[]> = signal([]);

  private readonly apiService = inject(ApiService);

  getAllGroups$(): Observable<Group[]> {
    return this.apiService
      .getRequest<Group[]>('groups')
      .pipe(tap((groups) => this.groupsList.set(groups)));
  }

  getAllUsers$(): Observable<User[]> {
    return this.apiService
      .getRequest<User[]>('users')
      .pipe(tap((users) => this.usersList.set(users)));
  }
}
